import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentEmailRequest {
  customerName: string;
  customerPhone: string;
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
    const { customerName, customerPhone, planName, amount, paymentId }: PaymentEmailRequest = await req.json();

    const ownerEmail = Deno.env.get("OWNER_EMAIL") || "mundoplaytv01@gmail.com";
    
    console.log("Sending payment notification to owner:", ownerEmail);
    console.log("Customer:", customerName);
    console.log("Phone:", customerPhone);
    console.log("Plan:", planName);
    console.log("Amount:", amount);
    console.log("Payment ID:", paymentId);

    const formattedAmount = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);

    const dateFormatted = new Date().toLocaleString('pt-BR', { 
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const emailResponse = await resend.emails.send({
      from: "Mundo Play TV <onboarding@resend.dev>",
      to: [ownerEmail],
      subject: `💰 Novo Pagamento - ${customerName} - ${planName} - ${formattedAmount}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Novo Pagamento Recebido</title>
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
                              Notificação de Pagamento
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
                              <span style="font-size: 32px;">💰</span>
                            </div>
                          </td>
                          <td>
                            <h2 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">
                              Novo Pagamento Recebido!
                            </h2>
                            <p style="margin: 5px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">
                              Cliente aguardando ativação
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Payment Details -->
                  <tr>
                    <td style="padding: 35px 30px;">
                      <h3 style="color: #f97316; font-size: 18px; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 1px;">
                        📋 Detalhes do Pagamento
                      </h3>
                      
                      <!-- Customer Info Box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, rgba(249,115,22,0.08) 0%, rgba(234,88,12,0.08) 100%); border-radius: 16px; border: 1px solid rgba(249,115,22,0.25); margin-bottom: 25px;">
                        <tr>
                          <td style="padding: 20px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="color: #94a3b8; font-size: 14px; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">👤 Cliente:</td>
                                <td style="color: #ffffff; font-size: 16px; font-weight: 600; text-align: right; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">${customerName}</td>
                              </tr>
                              <tr>
                                <td style="color: #94a3b8; font-size: 14px; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">📱 WhatsApp:</td>
                                <td style="color: #22c55e; font-size: 16px; font-weight: bold; text-align: right; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">${customerPhone || "Não informado"}</td>
                              </tr>
                              <tr>
                                <td style="color: #94a3b8; font-size: 14px; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">📦 Plano:</td>
                                <td style="color: #ffffff; font-size: 14px; font-weight: 600; text-align: right; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                                  <span style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 4px 12px; border-radius: 20px; font-size: 12px;">${planName}</span>
                                </td>
                              </tr>
                              <tr>
                                <td style="color: #94a3b8; font-size: 14px; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">💰 Valor:</td>
                                <td style="color: #22c55e; font-size: 20px; font-weight: bold; text-align: right; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">${formattedAmount}</td>
                              </tr>
                              <tr>
                                <td style="color: #94a3b8; font-size: 14px; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">🆔 ID Pagamento:</td>
                                <td style="color: #64748b; font-size: 12px; text-align: right; padding: 12px 0; font-family: 'Courier New', monospace; border-bottom: 1px solid rgba(255,255,255,0.05);">#${paymentId}</td>
                              </tr>
                              <tr>
                                <td style="color: #94a3b8; font-size: 14px; padding: 12px 0;">📅 Data/Hora:</td>
                                <td style="color: #ffffff; font-size: 14px; text-align: right; padding: 12px 0;">${dateFormatted}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Action Required -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1e3a5f 0%, #0c4a6e 100%); border-radius: 16px; overflow: hidden; margin-bottom: 25px;">
                        <tr>
                          <td style="padding: 20px; text-align: center;">
                            <h4 style="color: #38bdf8; font-size: 16px; margin: 0 0 10px 0;">
                              ⚡ Ação Necessária
                            </h4>
                            <p style="color: #ffffff; font-size: 14px; margin: 0;">
                              Entre em contato com o cliente para ativar o acesso!
                            </p>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- WhatsApp Button -->
                      ${customerPhone ? `
                      <div style="text-align: center;">
                        <a href="https://wa.me/${customerPhone.replace(/\D/g, '')}?text=Olá ${encodeURIComponent(customerName)}! 🎉 Seu pagamento do plano ${encodeURIComponent(planName)} foi confirmado! Vou enviar os dados de acesso agora." style="display: inline-block; background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 30px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 15px rgba(37,211,102,0.4);">
                          📱 Chamar Cliente no WhatsApp
                        </a>
                      </div>
                      ` : `
                      <div style="text-align: center;">
                        <p style="color: #ef4444; font-size: 14px;">⚠️ WhatsApp não informado - Verifique o sistema</p>
                      </div>
                      `}
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #0f172a 0%, #020617 100%); padding: 25px 30px; text-align: center; border-top: 1px solid rgba(249,115,22,0.2);">
                      <p style="color: #64748b; font-size: 12px; margin: 0;">
                        Notificação automática do sistema Mundo Play TV
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

    console.log("Email sent successfully to owner:", emailResponse);

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
