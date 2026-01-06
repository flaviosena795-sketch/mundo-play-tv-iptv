import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: `Você é um assistente de atendimento ao cliente da Mega IPTV Brasil, um serviço de IPTV premium.

INFORMAÇÕES SOBRE OS PLANOS:
- Mensal: R$ 34,90/mês - 1 conexão
- Trimestral: R$ 79,90 (3 meses) - 1 conexão - Mais vendido!
- Semestral: R$ 149,90 (6 meses) - 2 conexões
- Anual: R$ 249,90 (12 meses) - 3 conexões - Melhor custo-benefício

BENEFÍCIOS:
- +30.000 canais de TV ao vivo
- Canais em Full HD e 4K
- Filmes e séries on-demand
- Futebol ao vivo (todos os campeonatos)
- Suporte 24/7 via WhatsApp
- 12 horas de teste grátis

FORMAS DE PAGAMENTO:
- PIX (aprovação instantânea)
- Cartão de crédito
- Cartão de débito
- Mercado Pago

COMPATIBILIDADE:
- Smart TV (Samsung, LG, etc.)
- Android TV Box
- Celular/Tablet (Android e iOS)
- Computador
- Fire TV Stick
- Chromecast

INSTRUÇÕES:
- Seja amigável e prestativo
- Responda em português brasileiro
- Seja conciso (máximo 3-4 frases por resposta)
- Direcione dúvidas complexas para o WhatsApp: (11) 91234-5678
- Incentive o teste grátis de 12 horas
- Use emojis de forma moderada` 
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Muitas solicitações. Aguarde um momento e tente novamente." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Serviço temporariamente indisponível." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "Erro ao processar sua mensagem." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
