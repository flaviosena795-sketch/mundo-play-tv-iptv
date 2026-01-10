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
      subject: "🎬 Bem-vindo ao Mundo Play TV - Pagamento Confirmado!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Mundo Play TV - Confirmação de Pagamento</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #030712;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #030712; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%); border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.8);">
                  
                  <!-- Logo Header -->
                  <tr>
                    <td style="padding: 30px 30px 20px 30px; text-align: center; border-bottom: 1px solid rgba(249,115,22,0.2);">
                      <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                        <tr>
                          <td style="padding-right: 12px;">
                            <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                              <span style="font-size: 28px;">🌍</span>
                            </div>
                          </td>
                          <td>
                            <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">
                              MUNDO <span style="color: #f97316;">PLAY TV</span>
                            </h1>
                            <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">
                              O Mundo do Entretenimento
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Success Banner -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 25px 30px; text-align: center;">
                      <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                        <tr>
                          <td style="padding-right: 15px;">
                            <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.2); border-radius: 50%; text-align: center; line-height: 60px;">
                              <span style="font-size: 32px;">✅</span>
                            </div>
                          </td>
                          <td>
                            <h2 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">
                              Pagamento Confirmado!
                            </h2>
                            <p style="margin: 5px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">
                              Sua assinatura já está ativa
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Welcome Content -->
                  <tr>
                    <td style="padding: 35px 30px;">
                      <p style="color: #ffffff; font-size: 18px; margin: 0 0 8px 0;">
                        Olá, <strong style="color: #f97316;">${customerName}</strong>! 👋
                      </p>
                      <p style="color: #94a3b8; font-size: 15px; line-height: 1.7; margin: 0 0 25px 0;">
                        Parabéns! Seu pagamento foi processado com sucesso e agora você faz parte da família <strong style="color: #ffffff;">Mundo Play TV</strong>. Prepare-se para uma experiência única de entretenimento!
                      </p>
                      
                      <!-- Payment Receipt Box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, rgba(249,115,22,0.08) 0%, rgba(234,88,12,0.08) 100%); border-radius: 16px; border: 1px solid rgba(249,115,22,0.25); margin-bottom: 25px;">
                        <tr>
                          <td style="padding: 20px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td colspan="2" style="padding-bottom: 15px; border-bottom: 1px solid rgba(249,115,22,0.2);">
                                  <h3 style="color: #f97316; font-size: 14px; margin: 0; text-transform: uppercase; letter-spacing: 1.5px;">
                                    📋 Comprovante de Pagamento
                                  </h3>
                                </td>
                              </tr>
                              <tr>
                                <td style="color: #94a3b8; font-size: 14px; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">Plano Contratado:</td>
                                <td style="color: #ffffff; font-size: 14px; font-weight: 600; text-align: right; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                                  <span style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 4px 12px; border-radius: 20px; font-size: 12px;">${planName}</span>
                                </td>
                              </tr>
                              <tr>
                                <td style="color: #94a3b8; font-size: 14px; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">Valor Pago:</td>
                                <td style="color: #22c55e; font-size: 18px; font-weight: bold; text-align: right; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">${formattedAmount}</td>
                              </tr>
                              <tr>
                                <td style="color: #94a3b8; font-size: 14px; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">ID da Transação:</td>
                                <td style="color: #64748b; font-size: 11px; text-align: right; padding: 12px 0; font-family: 'Courier New', monospace; border-bottom: 1px solid rgba(255,255,255,0.05);">#${paymentId}</td>
                              </tr>
                              <tr>
                                <td style="color: #94a3b8; font-size: 14px; padding: 12px 0;">Data:</td>
                                <td style="color: #ffffff; font-size: 14px; text-align: right; padding: 12px 0;">${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Next Steps -->
                      <h3 style="color: #ffffff; font-size: 17px; margin: 0 0 18px 0; display: flex; align-items: center;">
                        🚀 Como Ativar Seu Acesso
                      </h3>
                      
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
                        <tr>
                          <td style="padding: 12px 15px; background: rgba(255,255,255,0.03); border-radius: 10px; margin-bottom: 8px;">
                            <table cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="width: 35px; vertical-align: top;">
                                  <div style="width: 28px; height: 28px; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); border-radius: 50%; text-align: center; line-height: 28px; font-size: 14px; color: #ffffff; font-weight: bold;">1</div>
                                </td>
                                <td style="color: #e2e8f0; font-size: 14px; line-height: 1.5;">
                                  <strong>Aguarde nossa mensagem no WhatsApp</strong><br>
                                  <span style="color: #94a3b8; font-size: 13px;">Enviaremos suas credenciais de acesso em até 15 minutos</span>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr><td style="height: 8px;"></td></tr>
                        <tr>
                          <td style="padding: 12px 15px; background: rgba(255,255,255,0.03); border-radius: 10px;">
                            <table cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="width: 35px; vertical-align: top;">
                                  <div style="width: 28px; height: 28px; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); border-radius: 50%; text-align: center; line-height: 28px; font-size: 14px; color: #ffffff; font-weight: bold;">2</div>
                                </td>
                                <td style="color: #e2e8f0; font-size: 14px; line-height: 1.5;">
                                  <strong>Instale o aplicativo recomendado</strong><br>
                                  <span style="color: #94a3b8; font-size: 13px;">Funciona em Smart TV, celular, tablet, TV Box e computador</span>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr><td style="height: 8px;"></td></tr>
                        <tr>
                          <td style="padding: 12px 15px; background: rgba(255,255,255,0.03); border-radius: 10px;">
                            <table cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="width: 35px; vertical-align: top;">
                                  <div style="width: 28px; height: 28px; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); border-radius: 50%; text-align: center; line-height: 28px; font-size: 14px; color: #ffffff; font-weight: bold;">3</div>
                                </td>
                                <td style="color: #e2e8f0; font-size: 14px; line-height: 1.5;">
                                  <strong>Configure e aproveite!</strong><br>
                                  <span style="color: #94a3b8; font-size: 13px;">+18.000 canais, filmes, séries e muito mais em 4K</span>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- What's Included -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1e3a5f 0%, #0c4a6e 100%); border-radius: 16px; overflow: hidden;">
                        <tr>
                          <td style="padding: 20px;">
                            <h4 style="color: #38bdf8; font-size: 14px; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">
                              🎬 O Que Você Vai Receber
                            </h4>
                            <table width="100%" cellpadding="5" cellspacing="0">
                              <tr>
                                <td style="color: #ffffff; font-size: 13px; padding: 6px 0;"><span style="color: #22c55e;">✓</span> +18.000 canais ao vivo (incluindo PPV)</td>
                                <td style="color: #ffffff; font-size: 13px; padding: 6px 0;"><span style="color: #22c55e;">✓</span> Filmes e séries atualizados</td>
                              </tr>
                              <tr>
                                <td style="color: #ffffff; font-size: 13px; padding: 6px 0;"><span style="color: #22c55e;">✓</span> Qualidade 4K Ultra HD</td>
                                <td style="color: #ffffff; font-size: 13px; padding: 6px 0;"><span style="color: #22c55e;">✓</span> 3 listas de servidores</td>
                              </tr>
                              <tr>
                                <td style="color: #ffffff; font-size: 13px; padding: 6px 0;"><span style="color: #22c55e;">✓</span> Guia de programação (EPG)</td>
                                <td style="color: #ffffff; font-size: 13px; padding: 6px 0;"><span style="color: #22c55e;">✓</span> Suporte 24/7 via WhatsApp</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- CTA Section -->
                  <tr>
                    <td style="padding: 0 30px 30px 30px; text-align: center;">
                      <p style="color: #94a3b8; font-size: 14px; margin: 0 0 15px 0;">
                        Precisa de ajuda? Nossa equipe está pronta para te atender!
                      </p>
                      <a href="https://wa.me/5521966238378?text=Olá! Acabei de fazer o pagamento do plano ${encodeURIComponent(planName)} e gostaria de ativar meu acesso. ID: ${paymentId}" style="display: inline-block; background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: #ffffff; text-decoration: none; padding: 14px 35px; border-radius: 30px; font-size: 15px; font-weight: bold; box-shadow: 0 4px 15px rgba(37,211,102,0.4);">
                        💬 Falar com Suporte no WhatsApp
                      </a>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #0f172a 0%, #020617 100%); padding: 25px 30px; text-align: center; border-top: 1px solid rgba(249,115,22,0.2);">
                      <p style="color: #64748b; font-size: 12px; margin: 0 0 8px 0;">
                        Este email foi enviado automaticamente após a confirmação do seu pagamento.
                      </p>
                      <p style="color: #475569; font-size: 11px; margin: 0 0 15px 0;">
                        Guarde este comprovante para sua referência.
                      </p>
                      <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                        <tr>
                          <td style="padding: 0 8px;">
                            <span style="color: #f97316; font-size: 18px;">🌍</span>
                          </td>
                          <td>
                            <p style="color: #94a3b8; font-size: 13px; font-weight: 600; margin: 0;">
                              Mundo Play TV
                            </p>
                          </td>
                        </tr>
                      </table>
                      <p style="color: #334155; font-size: 10px; margin: 15px 0 0 0;">
                        © ${new Date().getFullYear()} Mundo Play TV. Todos os direitos reservados.
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
