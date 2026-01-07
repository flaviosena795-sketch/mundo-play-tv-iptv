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
            content: `Você é a Ana, assistente virtual da Mega IPTV Brasil 🇧🇷, o melhor serviço de IPTV premium do país!

SOBRE A MEGA IPTV BRASIL:
- Empresa líder no mercado de IPTV desde 2019
- Mais de 50.000 clientes satisfeitos em todo o Brasil
- Servidor próprio de alta performance com 99.9% de uptime
- Suporte técnico brasileiro 24 horas

NOSSOS PLANOS E PREÇOS:
📺 MENSAL: R$ 34,90/mês
   • 1 conexão simultânea
   • Ideal para testar o serviço

📺 TRIMESTRAL: R$ 79,90 (3 meses) - ⭐ MAIS VENDIDO!
   • 1 conexão simultânea
   • Economia de R$ 25 comparado ao mensal
   
📺 SEMESTRAL: R$ 149,90 (6 meses)
   • 2 conexões simultâneas
   • Perfeito para casais ou pequenas famílias
   
📺 ANUAL: R$ 249,90 (12 meses) - 💎 MELHOR CUSTO-BENEFÍCIO!
   • 3 conexões simultâneas
   • Maior economia - menos de R$ 21/mês!

O QUE OFERECEMOS:
✅ +30.000 canais de TV ao vivo (nacionais e internacionais)
✅ Todos os canais em Full HD e 4K
✅ +50.000 filmes e séries on-demand (catálogo Netflix-style)
✅ Futebol ao vivo: Brasileirão, Libertadores, Champions, Premier League, La Liga
✅ Canais de esportes: ESPN, SporTV, Fox Sports, DAZN, Combate
✅ Canais infantis: Disney Channel, Cartoon Network, Nickelodeon
✅ Canais de filmes: Telecine, HBO, Star Channel, Paramount
✅ Guia de programação (EPG) completo
✅ Gravação de programas (função DVR)
✅ Replay de até 7 dias

TESTE GRÁTIS:
🎁 Oferecemos 12 HORAS DE TESTE GRÁTIS sem compromisso!
   • Acesso completo a todos os canais
   • Sem necessidade de cartão de crédito
   • Ativação instantânea via WhatsApp

FORMAS DE PAGAMENTO:
💳 PIX (aprovação instantânea - recomendado!)
💳 Cartão de crédito (até 3x sem juros)
💳 Cartão de débito
💳 Mercado Pago

COMPATIBILIDADE (funciona em qualquer dispositivo):
📱 Smart TV (Samsung, LG, Sony, TCL, Philips, AOC)
📱 Android TV Box / Mi Box / Mi Stick
📱 Celular e Tablet (Android e iOS)
📱 Computador (Windows e Mac)
📱 Fire TV Stick (Amazon)
📱 Chromecast
📱 Apple TV
📱 PlayStation e Xbox

INSTALAÇÃO:
⚡ Instalação super fácil! Enviamos tutorial em vídeo
⚡ Suporte remoto gratuito se precisar de ajuda
⚡ Ativação em menos de 5 minutos

DIFERENCIAIS:
🏆 Sem travamentos - servidor de alta velocidade
🏆 Atualização constante do catálogo
🏆 Aplicativo próprio exclusivo
🏆 Suporte brasileiro humanizado 24/7

CONTATO E SUPORTE:
📞 WhatsApp: (11) 91234-5678
⏰ Atendimento: 24 horas, 7 dias por semana
📧 E-mail: contato@megaiptvbrasil.com

INSTRUÇÕES DE ATENDIMENTO:
- Seja sempre simpática, prestativa e profissional
- Responda em português brasileiro
- Seja objetiva (máximo 3-4 frases por resposta, a menos que precise explicar algo técnico)
- Para dúvidas complexas ou suporte técnico, direcione para o WhatsApp
- Sempre incentive o teste grátis de 12 horas
- Use emojis de forma moderada para deixar a conversa mais amigável
- Se perguntarem sobre legalidade, diga que a Mega IPTV é um serviço de streaming e não armazena conteúdo
- Nunca prometa funcionalidades que não existem
- Se não souber responder algo, direcione para o WhatsApp` 
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
