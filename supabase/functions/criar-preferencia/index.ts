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
      console.error("[criar-preferencia] MERCADO_PAGO_ACCESS_TOKEN ausente");
      return new Response(
        JSON.stringify({ error: "MERCADO_PAGO_ACCESS_TOKEN não configurado" }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Use POST" }), 
        { 
          status: 405, 
          headers: { ...corsHeaders, "Allow": "POST", "Content-Type": "application/json" }
        }
      );
    }

    const body = await req.json().catch(() => null);
    
    const planNome = body?.plano?.nome || "Mensal";
    const planValor = body?.plano?.valor || 29.9;

    const whatsappMessage = `✅+Olá!+Acabei+de+realizar+o+pagamento+do+Plano+${encodeURIComponent(planNome)}+na+Mundo+Play+TV.%0A%0APoderia+me+enviar+a+minha+lista+IPTV,+por+favor?%0A%0A📞+Agradeço+desde+já!`;
    const whatsappUrl = `https://wa.me/5521966238378?text=${whatsappMessage}`;

    const prefPayload = {
      items: [
        {
          title: `Plano ${planNome}`,
          quantity: 1,
          unit_price: Number(planValor),
          currency_id: "BRL"
        }
      ],
      back_urls: {
        success: whatsappUrl,
        failure: "https://mundoplaytv.com.br/pagamento-falhou"
      },
      auto_return: "approved",
      external_reference: planNome.replace(/\s+/g, '_').toUpperCase()
    };

    console.log("[criar-preferencia] Criando preferência para plano:", planNome);

    const mpResp = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${mpToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(prefPayload)
    });

    const mpJson = await mpResp.json().catch(() => ({ error: "Resposta inválida do Mercado Pago" }));

    if (!mpResp.ok) {
      console.error("[criar-preferencia] MercadoPago erro:", mpResp.status, mpJson);
      return new Response(
        JSON.stringify({
          error: "Erro ao criar preferência no Mercado Pago",
          status: mpResp.status,
          details: mpJson
        }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    console.log("[criar-preferencia] Preferência criada com sucesso:", mpJson.id);

    return new Response(
      JSON.stringify({
        init_point: mpJson.init_point,
        preference_id: mpJson.id
      }), 
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (err) {
    console.error("[criar-preferencia] erro interno:", err);
    return new Response(
      JSON.stringify({ error: "Erro interno" }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
