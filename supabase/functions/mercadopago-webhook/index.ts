import { serve } from "https://deno.land/std@0.181.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const mpToken = Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN");
    if (!mpToken) {
      console.error("[mercadopago-webhook] MERCADO_PAGO_ACCESS_TOKEN ausente");
      return new Response(
        JSON.stringify({ error: "Configuração inválida" }), 
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse webhook notification
    const body = await req.json().catch(() => null);
    
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
        date_approved: payment.date_approved
      }));

      // Process based on payment status
      switch (payment.status) {
        case 'approved':
          console.log(`[mercadopago-webhook] ✅ PAGAMENTO APROVADO - ID: ${payment.id}, Ref: ${payment.external_reference}, Valor: R$${payment.transaction_amount}`);
          // Here you could:
          // - Save to database
          // - Send confirmation email
          // - Trigger activation process
          // - Send WhatsApp notification
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
          payment_status: payment.status
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
