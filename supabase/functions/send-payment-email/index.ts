import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentEmailRequest {
  customerName: string;
  customerEmail: string;
  planName: string;
  amount: number;
  paymentId: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("=== Send Payment Email Function Called ===");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customerName, customerEmail, planName, amount, paymentId }: PaymentEmailRequest = await req.json();

    console.log("Sending payment confirmation email to:", customerEmail);
    console.log("Customer:", customerName);
    console.log("Plan:", planName);
    console.log("Amount:", amount);
    console.log("Payment ID:", paymentId);

    const formattedAmount = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);

    const emailResponse = await resend.emails.send({
      from: "Mundo Play TV <onboarding@resend.dev>",
      to: [customerEmail],
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
                        Olá, <strong>${customerName}</strong>! 👋
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
                                <td style="color: #ffffff; font-size: 14px; font-weight: bold; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.1);">${planName}</td>
                              </tr>
                              <tr>
                                <td style="color: #a0aec0; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.1);">Valor:</td>
                                <td style="color: #22c55e; font-size: 14px; font-weight: bold; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.1);">${formattedAmount}</td>
                              </tr>
                              <tr>
                                <td style="color: #a0aec0; font-size: 14px;">ID do Pagamento:</td>
                                <td style="color: #ffffff; font-size: 12px; text-align: right; font-family: monospace;">${paymentId}</td>
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
                      <a href="https://wa.me/5511999999999" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; padding: 10px 25px; border-radius: 25px; font-size: 14px; font-weight: bold;">
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

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending payment email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
