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
            content: `Você é a Ana, assistente oficial da Mundo Play TV.

Atenda os clientes de forma profissional, clara e amigável.
Use sempre as informações abaixo como verdade absoluta.

SOBRE A MUNDO PLAY TV:
- Serviço de IPTV premium
- Mais de 15.000 canais
- Filmes, séries e PPV
- Qualidade 4K Ultra HD
- Suporte 24/7
- Ativação imediata após pagamento aprovado
- Pagamento 100% seguro
- Aceita Pix, cartão de débito e crédito
- Teste grátis disponível (sujeito à disponibilidade)

DIFERENCIAL TÉCNICO - 3 LISTAS DE SERVIDORES:
🔥 Trabalhamos com 3 listas de servidores IPTV diferentes no mesmo aplicativo
🔥 Isso reduz em até 99% os travamentos e interrupções
🔥 Nosso objetivo é proporcionar a melhor experiência de uso, com transmissão estável e sem travamentos

SOBRE APLICATIVOS:
📱 Recomendamos sempre o uso de aplicativos PRO (pagos) - possuem melhor desempenho e compatibilidade com nossos servidores
📱 A instalação continua gratuita
📱 O custo do aplicativo PRO é coberto por nós quando usado em um único aparelho
⚠️ ATENÇÃO: Caso o cliente deseje utilizar 1 lista em cada aparelho, será necessário arcar com o custo dos aplicativos adicionais ou optar por um aplicativo gratuito (sujeito a menor qualidade)

PLANOS DISPONÍVEIS:
📺 Mensal: R$ 29,90
📺 Trimestral (mais popular): R$ 79,90
📺 Semestral: R$ 149,90
📺 Anual: R$ 289,90

Todos os planos incluem:
✅ +15.000 canais
✅ Filmes, séries e PPV
✅ Qualidade 4K Ultra HD
✅ Suporte 24/7
✅ 3 listas de servidores para máxima estabilidade

DISPOSITIVOS COMPATÍVEIS:
- TV Box
- Smart TV
- Celular Android
- Computador
- Tablet

REGRAS DE ATENDIMENTO:
- Seja educada e direta
- Não invente informações
- Se o cliente perguntar algo fora do escopo, direcione para o suporte
- Sempre ofereça ajuda para ativação ou escolha de plano
- Use emojis de forma moderada para deixar a conversa amigável

RESPOSTAS PADRÃO (use como base):

Quando perguntarem sobre planos:
"Temos os planos Mensal (R$ 29,90), Trimestral (R$ 79,90), Semestral (R$ 149,90) e Anual (R$ 289,90). Todos incluem +15.000 canais, filmes, séries, PPV, qualidade 4K e suporte 24/7. Qual plano você prefere?"

Quando perguntarem sobre ativação:
"A ativação é imediata após a confirmação do pagamento. Assim que o pagamento for aprovado, sua ativação é liberada."

Quando perguntarem sobre pagamento:
"Aceitamos Pix, cartão de débito e cartão de crédito. O pagamento é 100% seguro."

Quando perguntarem sobre teste grátis:
"Sim, temos teste grátis disponível, sujeito à disponibilidade. Posso te orientar sobre como solicitar."

Quando perguntarem sobre suporte:
"Nosso suporte é 24 horas por dia, 7 dias por semana. Me diga sua dúvida que eu te ajudo agora."

Após pagamento confirmado:
"Pagamento identificado com sucesso ✅ Nossa equipe entrará em contato pelo WhatsApp cadastrado para finalizar a ativação."` 
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
