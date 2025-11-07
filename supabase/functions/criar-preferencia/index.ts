import { serve } from "https://deno.land/std@0.181.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Valid plans whitelist
const VALID_PLANS: Record<string, number> = {
  "Mensal": 29.9,
  "Trimestral": 79.9,
  "Semestral": 149.9,
  "Anual": 289.9
};

// Rate limiting: in-memory store (resets on function cold start)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute per IP

function getClientIP(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0] || 
         req.headers.get('x-real-ip') || 
         'unknown';
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    // New window or expired window
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  record.count++;
  return { allowed: true };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting check
    const clientIP = getClientIP(req);
    const rateLimitResult = checkRateLimit(clientIP);
    
    if (!rateLimitResult.allowed) {
      console.warn(`[criar-preferencia] Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: "Muitas tentativas. Tente novamente em alguns instantes." }), 
        { 
          status: 429,
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json",
            "Retry-After": String(rateLimitResult.retryAfter || 60)
          }
        }
      );
    }

    const mpToken = Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN");
    if (!mpToken) {
      console.error("[criar-preferencia] MERCADO_PAGO_ACCESS_TOKEN ausente");
      return new Response(
        JSON.stringify({ error: "Serviço temporariamente indisponível" }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Método não permitido" }), 
        { 
          status: 405, 
          headers: { ...corsHeaders, "Allow": "POST", "Content-Type": "application/json" }
        }
      );
    }

    const body = await req.json().catch(() => null);
    
    if (!body?.plano?.nome) {
      return new Response(
        JSON.stringify({ error: "Plano não especificado" }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const planNome = body.plano.nome;
    
    // Input validation: Check if plan exists in whitelist
    if (!VALID_PLANS.hasOwnProperty(planNome)) {
      console.warn(`[criar-preferencia] Plano inválido tentado: ${planNome}`);
      return new Response(
        JSON.stringify({ error: "Plano inválido" }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Use only the validated plan value from whitelist
    const planValor = VALID_PLANS[planNome];

    // Get the site URL from environment or use origin from request
    const origin = req.headers.get('origin') || req.headers.get('referer')?.split('/').slice(0, 3).join('/') || 'https://mundoplaytv.com.br';
    
    const prefPayload = {
      items: [
        {
          title: `Plano ${planNome} - Mundo Play TV`,
          quantity: 1,
          unit_price: Number(planValor),
          currency_id: "BRL"
        }
      ],
      back_urls: {
        success: `${origin}/sucesso?plano=${encodeURIComponent(planNome)}&valor=${planValor}`,
        failure: `${origin}/falha?erro=rejeitado`,
        pending: `${origin}/falha?erro=timeout`
      },
      auto_return: "approved",
      external_reference: `${planNome.replace(/\s+/g, '_').toUpperCase()}_${Date.now()}`,
      notification_url: undefined, // Adicione webhook URL aqui quando implementar
      statement_descriptor: "MUNDO PLAY TV"
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
      // Log detailed error for debugging, but don't expose to client
      console.error("[criar-preferencia] MercadoPago erro:", mpResp.status, JSON.stringify(mpJson));
      return new Response(
        JSON.stringify({ error: "Erro ao processar pagamento. Tente novamente." }), 
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
      JSON.stringify({ error: "Erro ao processar pagamento. Tente novamente." }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
