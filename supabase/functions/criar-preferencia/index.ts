import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { plano, nomeCliente } = await req.json();
    console.log('Creating preference for:', { plano, nomeCliente });

    const mercadoPagoAccessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');
    
    if (!mercadoPagoAccessToken) {
      throw new Error('MERCADO_PAGO_ACCESS_TOKEN not configured');
    }
    
    const preferenceData = {
      items: [
        {
          title: `Plano ${plano.nome} - Mundo Play TV`,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: Number(plano.valor)
        }
      ],
      payer: {
        name: nomeCliente
      },
      back_urls: {
        success: `https://wa.me/5521966238378?text=✅%20Olá!%20Meu%20nome%20é%20${encodeURIComponent(nomeCliente)}%20e%20acabei%20de%20pagar%20o%20plano%20${encodeURIComponent(plano.nome)}%20no%20site.%20Poderia%20me%20enviar%20minha%20lista%20IPTV?`,
        failure: 'https://mundoplaytv.com.br/falha',
        pending: 'https://mundoplaytv.com.br/aguardando'
      },
      auto_return: 'approved',
      statement_descriptor: 'MUNDO PLAY TV',
      external_reference: `${plano.nome}-${Date.now()}`
    };

    console.log('Sending to Mercado Pago:', preferenceData);

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mercadoPagoAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferenceData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Mercado Pago API error:', errorText);
      throw new Error(`Mercado Pago API error: ${errorText}`);
    }

    const data = await response.json();
    console.log('Preference created successfully:', data.id);

    return new Response(
      JSON.stringify({ 
        preferenceId: data.id,
        initPoint: data.init_point 
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in criar-preferencia function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
