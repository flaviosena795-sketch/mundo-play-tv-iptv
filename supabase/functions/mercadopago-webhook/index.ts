import { serve } from "https://deno.land/std@0.181.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// WhatsApp support number
const WHATSAPP_SUPPORT = "5521966238378";

// Initialize Resend for email notifications
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Security monitoring - track invalid signature attempts
interface SecurityEvent {
  timestamp: string;
  ip: string | null;
  userAgent: string | null;
  reason: string;
  xSignature: string | null;
  xRequestId: string | null;
}

function logSecurityEvent(req: Request, reason: string, xSignature?: string | null, xRequestId?: string | null) {
  const event: SecurityEvent = {
    timestamp: new Date().toISOString(),
    ip: req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown',
    userAgent: req.headers.get('user-agent'),
    reason,
    xSignature: xSignature ? xSignature.substring(0, 30) + '...' : null,
    xRequestId: xRequestId || null
  };
  
  console.error(`[SECURITY ALERT] ⚠️ Invalid webhook attempt:`, JSON.stringify(event));
  
  // You can extend this to store in database or send alerts
  return event;
}

// Verify Mercado Pago webhook signature using HMAC-SHA256
async function verifySignature(req: Request, bodyText: string): Promise<{ valid: boolean; reason?: string }> {
  const webhookSecret = Deno.env.get('MP_WEBHOOK_SECRET');
  
  if (!webhookSecret) {
    console.warn("[mercadopago-webhook] MP_WEBHOOK_SECRET não configurado - verificação de assinatura ignorada");
    return { valid: true }; // Allow requests if secret not configured (for backward compatibility)
  }

  const xSignature = req.headers.get('x-signature');
  const xRequestId = req.headers.get('x-request-id');

  if (!xSignature || !xRequestId) {
    logSecurityEvent(req, 'missing_headers', xSignature, xRequestId);
    return { valid: false, reason: 'missing_headers' };
  }

  // Parse the x-signature header (format: "ts=timestamp,v1=hash")
  const signatureParts: Record<string, string> = {};
  xSignature.split(',').forEach(part => {
    const [key, value] = part.split('=');
    if (key && value) {
      signatureParts[key.trim()] = value.trim();
    }
  });

  const ts = signatureParts['ts'];
  const v1 = signatureParts['v1'];

  if (!ts || !v1) {
    logSecurityEvent(req, 'invalid_signature_format', xSignature, xRequestId);
    return { valid: false, reason: 'invalid_signature_format' };
  }

  // Check timestamp to prevent replay attacks (allow 5 minute window)
  const signatureTimestamp = parseInt(ts, 10) * 1000; // Convert to milliseconds
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  
  if (isNaN(signatureTimestamp) || Math.abs(now - signatureTimestamp) > fiveMinutes) {
    logSecurityEvent(req, 'timestamp_expired_or_invalid', xSignature, xRequestId);
    return { valid: false, reason: 'timestamp_expired' };
  }

  // Parse body to get data.id for the manifest
  let dataId = '';
  try {
    const payload = JSON.parse(bodyText);
    dataId = payload.data?.id?.toString() || '';
  } catch {
    logSecurityEvent(req, 'invalid_body_json', xSignature, xRequestId);
    return { valid: false, reason: 'invalid_body' };
  }

  // Build the manifest string as per Mercado Pago docs
  // manifest = "id:{data.id};request-id:{x-request-id};ts:{ts};"
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

  // Generate HMAC-SHA256
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(webhookSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(manifest)
  );

  // Convert to hex
  const hashArray = Array.from(new Uint8Array(signature));
  const computedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  // Compare signatures (constant-time comparison would be better but this is acceptable)
  const isValid = computedHash === v1;
  
  if (!isValid) {
    logSecurityEvent(req, 'signature_mismatch', xSignature, xRequestId);
    console.error("[mercadopago-webhook] Verificação de assinatura falhou", { 
      expected: v1.substring(0, 10) + '...', 
      computed: computedHash.substring(0, 10) + '...',
      manifest 
    });
    return { valid: false, reason: 'signature_mismatch' };
  }
  
  console.log("[mercadopago-webhook] ✅ Assinatura verificada com sucesso");
  return { valid: true };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Read body as text first for signature verification
    const bodyText = await req.text();
    
    // Verify webhook signature BEFORE processing
    const signatureResult = await verifySignature(req, bodyText);
    
    if (!signatureResult.valid) {
      console.error(`[mercadopago-webhook] ❌ Assinatura inválida - requisição rejeitada (reason: ${signatureResult.reason})`);
      return new Response(
        JSON.stringify({ error: "Assinatura inválida" }), 
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const mpToken = Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!mpToken) {
      console.error("[mercadopago-webhook] MERCADO_PAGO_ACCESS_TOKEN ausente");
      return new Response(
        JSON.stringify({ error: "Configuração inválida" }), 
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("[mercadopago-webhook] Supabase credentials ausentes");
      return new Response(
        JSON.stringify({ error: "Configuração de banco inválida" }), 
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client with service role
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse webhook notification from the already-read body
    let body;
    try {
      body = JSON.parse(bodyText);
    } catch {
      body = null;
    }
    
    console.log("[mercadopago-webhook] Notificação recebida:", JSON.stringify(body));

    if (!body) {
      return new Response(
        JSON.stringify({ error: "Payload inválido" }), 
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Mercado Pago sends different types of notifications
    const { type, data, action } = body;

    // Handle payment notifications
    if (type === 'payment' || action === 'payment.created' || action === 'payment.updated') {
      const paymentId = data?.id;
      
      if (!paymentId) {
        console.warn("[mercadopago-webhook] Payment ID não encontrado");
        return new Response(
          JSON.stringify({ status: "ignored", reason: "no_payment_id" }), 
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Fetch payment details from Mercado Pago
      const paymentResp = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          "Authorization": `Bearer ${mpToken}`,
        }
      });

      if (!paymentResp.ok) {
        console.error("[mercadopago-webhook] Erro ao buscar pagamento:", paymentResp.status);
        return new Response(
          JSON.stringify({ error: "Erro ao verificar pagamento" }), 
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const payment = await paymentResp.json();
      
      console.log("[mercadopago-webhook] Detalhes do pagamento:", JSON.stringify({
        id: payment.id,
        status: payment.status,
        status_detail: payment.status_detail,
        external_reference: payment.external_reference,
        transaction_amount: payment.transaction_amount,
        payer_email: payment.payer?.email,
        payer_name: payment.payer?.first_name,
        date_approved: payment.date_approved
      }));

      // Extract plan name from external_reference (format: "plano_nome_telefone")
      const externalRef = payment.external_reference || "";
      const refParts = externalRef.split("_");
      const planName = refParts[0] || null;
      const payerName = refParts.length > 1 ? refParts.slice(1, -1).join(" ") : payment.payer?.first_name;
      const payerPhone = refParts.length > 1 ? refParts[refParts.length - 1] : null;

      // Prepare payment data for database
      const paymentData = {
        payment_id: String(payment.id),
        external_reference: payment.external_reference,
        status: payment.status,
        status_detail: payment.status_detail,
        transaction_amount: payment.transaction_amount,
        payer_email: payment.payer?.email,
        payer_name: payerName || payment.payer?.first_name,
        payer_phone: payerPhone || payment.payer?.phone?.number,
        plan_name: planName,
        date_approved: payment.date_approved,
        date_created: payment.date_created,
        payment_method: payment.payment_method_id,
        payment_type: payment.payment_type_id,
        raw_data: payment
      };

      // Save or update payment in database
      const { error: dbError } = await supabase
        .from('payments')
        .upsert(paymentData, { 
          onConflict: 'payment_id',
          ignoreDuplicates: false 
        });

      if (dbError) {
        console.error("[mercadopago-webhook] Erro ao salvar no banco:", dbError);
      } else {
        console.log("[mercadopago-webhook] Pagamento salvo no banco com sucesso");
      }

      // Process based on payment status
      switch (payment.status) {
        case 'approved':
          console.log(`[mercadopago-webhook] ✅ PAGAMENTO APROVADO - ID: ${payment.id}, Ref: ${payment.external_reference}, Valor: R$${payment.transaction_amount}`);
          
          // Send WhatsApp notification for approved payments
          await sendWhatsAppNotification({
            paymentId: payment.id,
            payerName: payerName || payment.payer?.first_name || "Cliente",
            payerPhone: payerPhone,
            payerEmail: payment.payer?.email,
            planName: planName,
            amount: payment.transaction_amount,
            dateApproved: payment.date_approved,
            paymentMethod: payment.payment_method_id,
            paymentType: payment.payment_type_id
          });
          
          // Send confirmation email to customer
          if (payment.payer?.email) {
            await sendPaymentConfirmationEmail({
              customerName: payerName || payment.payer?.first_name || "Cliente",
              customerEmail: payment.payer.email,
              planName: planName || "Plano IPTV",
              amount: payment.transaction_amount,
              paymentId: String(payment.id)
            });
          }
          break;
          
        case 'pending':
        case 'in_process':
          console.log(`[mercadopago-webhook] ⏳ PAGAMENTO PENDENTE - ID: ${payment.id}, Status: ${payment.status_detail}`);
          break;
          
        case 'rejected':
          console.log(`[mercadopago-webhook] ❌ PAGAMENTO REJEITADO - ID: ${payment.id}, Motivo: ${payment.status_detail}`);
          break;
          
        case 'refunded':
        case 'cancelled':
          console.log(`[mercadopago-webhook] 🔄 PAGAMENTO ${payment.status.toUpperCase()} - ID: ${payment.id}`);
          break;
          
        default:
          console.log(`[mercadopago-webhook] ℹ️ Status: ${payment.status} - ID: ${payment.id}`);
      }

      return new Response(
        JSON.stringify({ 
          status: "processed",
          payment_id: payment.id,
          payment_status: payment.status,
          saved_to_db: !dbError
        }), 
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Handle merchant_order notifications (optional)
    if (type === 'merchant_order') {
      console.log("[mercadopago-webhook] Merchant order recebida:", data?.id);
      return new Response(
        JSON.stringify({ status: "merchant_order_received" }), 
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Unknown notification type
    console.log("[mercadopago-webhook] Tipo de notificação não tratado:", type || action);
    return new Response(
      JSON.stringify({ status: "ignored", type: type || action }), 
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("[mercadopago-webhook] Erro interno:", err);
    return new Response(
      JSON.stringify({ error: "Erro interno" }), 
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Function to send WhatsApp notification via Evolution API or similar
async function sendWhatsAppNotification(data: {
  paymentId: number;
  payerName: string;
  payerPhone: string | null;
  payerEmail: string | null;
  planName: string | null;
  amount: number;
  dateApproved: string | null;
  paymentMethod: string | null;
  paymentType: string | null;
}) {
  const evolutionApiUrl = Deno.env.get("EVOLUTION_API_URL");
  const evolutionApiKey = Deno.env.get("EVOLUTION_API_KEY");
  const evolutionInstance = Deno.env.get("EVOLUTION_INSTANCE");

  // Format date
  const dateFormatted = data.dateApproved 
    ? new Date(data.dateApproved).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
    : new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

  // Format payment method for display
  const formatPaymentMethod = (method: string | null, type: string | null): string => {
    if (!method && !type) return "Não identificado";
    
    const methodMap: Record<string, string> = {
      'pix': '💠 PIX',
      'credit_card': '💳 Cartão de Crédito',
      'debit_card': '💳 Cartão de Débito',
      'account_money': '💰 Dinheiro em Conta',
      'bolbradesco': '📄 Boleto Bradesco',
      'ticket': '📄 Boleto',
      'master': '💳 Mastercard',
      'visa': '💳 Visa',
      'elo': '💳 Elo',
      'amex': '💳 American Express',
      'hipercard': '💳 Hipercard'
    };

    const typeMap: Record<string, string> = {
      'credit_card': 'Crédito',
      'debit_card': 'Débito',
      'bank_transfer': 'Transferência',
      'ticket': 'Boleto',
      'account_money': 'Saldo MP'
    };

    // Check method first
    if (method && methodMap[method.toLowerCase()]) {
      return methodMap[method.toLowerCase()];
    }

    // If it's a card brand, add the type
    if (method && type && (type === 'credit_card' || type === 'debit_card')) {
      const brand = method.charAt(0).toUpperCase() + method.slice(1);
      const cardType = typeMap[type] || type;
      return `💳 ${brand} (${cardType})`;
    }

    // Fallback
    return method || type || "Não identificado";
  };

  const paymentMethodFormatted = formatPaymentMethod(data.paymentMethod, data.paymentType);

  // Build notification message for support
  const supportMessage = `✅ *PAGAMENTO APROVADO*

👤 *Cliente:* ${data.payerName}
📱 *WhatsApp:* ${data.payerPhone || "Não informado"}
📦 *Plano:* ${data.planName || "Não identificado"}
💳 *Meio:* ${paymentMethodFormatted}
💰 *Valor:* R$ ${data.amount?.toFixed(2) || "0.00"}
🆔 *Pagamento:* ${data.paymentId}
📅 *Data:* ${dateFormatted}

✅ *Ação:* Ativar acesso do cliente`;

  // If Evolution API is configured, send via API
  if (evolutionApiUrl && evolutionApiKey && evolutionInstance) {
    try {
      const response = await fetch(`${evolutionApiUrl}/message/sendText/${evolutionInstance}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': evolutionApiKey
        },
        body: JSON.stringify({
          number: WHATSAPP_SUPPORT,
          text: supportMessage
        })
      });

      if (response.ok) {
        console.log("[mercadopago-webhook] ✅ Notificação WhatsApp enviada com sucesso via Evolution API");
        return true;
      } else {
        const errorText = await response.text();
        console.error("[mercadopago-webhook] Erro ao enviar WhatsApp via Evolution:", errorText);
      }
    } catch (error) {
      console.error("[mercadopago-webhook] Erro ao conectar com Evolution API:", error);
    }
  } else {
    console.log("[mercadopago-webhook] Evolution API não configurada. Notificação registrada apenas em log:");
    console.log("[mercadopago-webhook] 📱 NOTIFICAÇÃO WHATSAPP:", supportMessage);
    console.log("[mercadopago-webhook] 💡 Para envio automático, configure EVOLUTION_API_URL, EVOLUTION_API_KEY e EVOLUTION_INSTANCE");
  }

  return false;
}

// Function to send payment confirmation email via Resend
async function sendPaymentConfirmationEmail(data: {
  customerName: string;
  customerEmail: string;
  planName: string;
  amount: number;
  paymentId: string;
}) {
  try {
    const formattedAmount = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(data.amount);

    console.log(`[mercadopago-webhook] 📧 Enviando email de confirmação para: ${data.customerEmail}`);

    const emailResponse = await resend.emails.send({
      from: "Mundo Play TV <onboarding@resend.dev>",
      to: [data.customerEmail],
      subject: "✅ Pagamento Confirmado - Mundo Play TV",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a1a;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a1a; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                        🎉 Pagamento Confirmado!
                      </h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <p style="color: #ffffff; font-size: 18px; margin: 0 0 20px 0;">
                        Olá, <strong>${data.customerName}</strong>! 👋
                      </p>
                      
                      <p style="color: #a0aec0; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                        Seu pagamento foi processado com sucesso! Agora você tem acesso completo ao Mundo Play TV.
                      </p>
                      
                      <!-- Payment Details Box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(255,255,255,0.05); border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                        <tr>
                          <td>
                            <h3 style="color: #f97316; font-size: 16px; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 1px;">
                              📋 Detalhes do Pagamento
                            </h3>
                            
                            <table width="100%" cellpadding="8" cellspacing="0">
                              <tr>
                                <td style="color: #a0aec0; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.1);">Plano:</td>
                                <td style="color: #ffffff; font-size: 14px; font-weight: bold; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.1);">${data.planName}</td>
                              </tr>
                              <tr>
                                <td style="color: #a0aec0; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.1);">Valor:</td>
                                <td style="color: #22c55e; font-size: 14px; font-weight: bold; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.1);">${formattedAmount}</td>
                              </tr>
                              <tr>
                                <td style="color: #a0aec0; font-size: 14px;">ID do Pagamento:</td>
                                <td style="color: #ffffff; font-size: 12px; text-align: right; font-family: monospace;">${data.paymentId}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- What's Next -->
                      <h3 style="color: #ffffff; font-size: 18px; margin: 0 0 15px 0;">
                        🚀 Próximos Passos
                      </h3>
                      
                      <ol style="color: #a0aec0; font-size: 14px; line-height: 2; margin: 0 0 30px 0; padding-left: 20px;">
                        <li>Você receberá suas credenciais de acesso via WhatsApp</li>
                        <li>Instale o aplicativo recomendado no seu dispositivo</li>
                        <li>Configure com as credenciais recebidas</li>
                        <li>Aproveite +18.000 canais em qualidade 4K!</li>
                      </ol>
                      
                      <!-- Features -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, rgba(249,115,22,0.1) 0%, rgba(234,88,12,0.1) 100%); border-radius: 12px; padding: 20px; border: 1px solid rgba(249,115,22,0.3);">
                        <tr>
                          <td>
                            <p style="color: #f97316; font-size: 14px; font-weight: bold; margin: 0 0 10px 0;">
                              ✨ O que está incluso:
                            </p>
                            <p style="color: #ffffff; font-size: 13px; line-height: 1.8; margin: 0;">
                              ✅ +18.000 canais ao vivo<br>
                              ✅ Filmes, séries e PPV<br>
                              ✅ Qualidade 4K Ultra HD<br>
                              ✅ 3 listas de servidores para máxima estabilidade<br>
                              ✅ Suporte 24/7 via WhatsApp
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: rgba(0,0,0,0.3); padding: 25px 30px; text-align: center;">
                      <p style="color: #a0aec0; font-size: 12px; margin: 0 0 10px 0;">
                        Dúvidas? Entre em contato pelo WhatsApp
                      </p>
                      <a href="https://wa.me/${WHATSAPP_SUPPORT}" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; padding: 10px 25px; border-radius: 25px; font-size: 14px; font-weight: bold;">
                        💬 Falar no WhatsApp
                      </a>
                      <p style="color: #666; font-size: 11px; margin: 20px 0 0 0;">
                        © 2025 Mundo Play TV. Todos os direitos reservados.
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    console.log("[mercadopago-webhook] ✅ Email de confirmação enviado:", JSON.stringify(emailResponse));
    return true;
  } catch (error: any) {
    console.error("[mercadopago-webhook] ❌ Erro ao enviar email de confirmação:", error.message);
    return false;
  }
}
