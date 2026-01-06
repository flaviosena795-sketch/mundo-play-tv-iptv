import { serve } from "https://deno.land/std@0.181.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// WhatsApp support number
const WHATSAPP_SUPPORT = "5521966238378";

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
