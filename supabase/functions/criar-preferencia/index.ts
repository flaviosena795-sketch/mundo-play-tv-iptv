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
    const mpToken = Deno.env.get("MP_ACCESS_TOKEN");
    if (!mpToken) {
      console.error("[criar-preferencia] MP_ACCESS_TOKEN ausente");
      return new Response(
        JSON.stringify({ error: "MP_ACCESS_TOKEN não configurado" }), 
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
    
    // Exemplo de mapeamento de planos — ajuste conforme seu front
    const PLANS: Record<string, { title: string; price: number }> = {
      mensal: { title: "Plano Mensal - Mundo Play TV", price: 29.9 },
      trimestral: { title: "Plano Trimestral - Mundo Play TV", price: 79.9 },
      semestral: { title: "Plano Semestral - Mundo Play TV", price: 149.9 },
      anual: { title: "Plano Anual - Mundo Play TV", price: 289.9 },
    };

    const planId = body?.planId || "mensal";
    const plan = PLANS[planId];
    if (!plan) {
      return new Response(
        JSON.stringify({ error: "Plano inválido" }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const prefPayload = {
      items: [
        {
          title: plan.title,
          quantity: 1,
          unit_price: Number(plan.price),
          currency_id: "BRL"
        }
      ],
      back_urls: {
        success: Deno.env.get("MP_SUCCESS_URL") || "https://mundoplaytv.com.br/success",
        failure: Deno.env.get("MP_FAILURE_URL") || "https://mundoplaytv.com.br/failure",
        pending: Deno.env.get("MP_PENDING_URL") || "https://mundoplaytv.com.br/pending"
      },
      auto_return: "approved",
      external_reference: body?.external_reference || undefined
    };

    console.log("[criar-preferencia] Criando preferência para plano:", planId);

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
