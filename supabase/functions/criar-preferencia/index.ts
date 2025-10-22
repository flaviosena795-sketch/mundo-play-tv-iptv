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
          title: `Mundo Play TV - ${plano.nome}`,
          description: `Plano ${plano.nome} - +15.000 canais, 4K Ultra HD, Filmes, Séries, PPV`,
          quantity: 1,
          unit_price: plano.valor,
          currency_id: 'BRL'
        }
      ],
      payer: {
        name: nomeCliente
      },
      back_urls: {
        success: `${Deno.env.get('VITE_SUPABASE_URL')}/functions/v1/payment-success`,
        failure: `${Deno.env.get('VITE_SUPABASE_URL')}/functions/v1/payment-failure`,
        pending: `${Deno.env.get('VITE_SUPABASE_URL')}/functions/v1/payment-pending`
      },
      auto_return: 'approved',
      notification_url: `${Deno.env.get('VITE_SUPABASE_URL')}/functions/v1/payment-webhook`,
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
