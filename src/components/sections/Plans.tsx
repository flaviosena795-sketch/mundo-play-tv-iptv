import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { useEffect, useRef } from "react";

const Plans = () => {
  const plans = [
    {
      name: "Mensal",
      price: "R$ 29,90",
      valor: 29.9,
      period: "/mês",
      preferenceId: "2958149440-2f7a472e-cc62-40aa-8af8-76cb59afa6ae",
      features: [
        "+15.000 canais",
        "Qualidade 4K Ultra HD",
        "Filmes, séries e PPV",
        "Suporte 24/7",
      ],
      popular: false,
    },
    {
      name: "Trimestral",
      price: "R$ 79,90",
      valor: 79.9,
      period: "/3 meses",
      preferenceId: "2958149440-156edd14-256f-4991-a143-e9d3695c73dc",
      features: [
        "+15.000 canais",
        "4K Ultra HD",
        "Filmes, séries e PPV",
        "Suporte 24/7",
      ],
      popular: true,
    },
    {
      name: "Semestral",
      price: "R$ 149,90",
      valor: 149.9,
      period: "/6 meses",
      preferenceId: "2958149440-83ee8536-6684-49be-b461-a92dd86874f1",
      features: [
        "+15.000 canais",
        "4K Ultra HD",
        "Filmes, séries e PPV",
        "Suporte 24/7",
      ],
      popular: false,
    },
    {
      name: "Anual",
      price: "R$ 289,90",
      valor: 289.9,
      period: "/ano",
      preferenceId: "2958149440-3548c015-87b9-41b5-93cf-6c4f1407f4d0",
      features: [
        "+15.000 canais",
        "4K Ultra HD",
        "Filmes, séries e PPV",
        "Suporte 24/7",
      ],
      popular: false,
    },
  ];

  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Load Mercado Pago script
    const script = document.createElement("script");
    script.src = "https://www.mercadopago.com.br/integrations/v1/web-payment-checkout.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Create checkout buttons for each plan
      plans.forEach((plan, index) => {
        const container = containerRefs.current[index];
        if (container) {
          container.innerHTML = "";
          const buttonScript = document.createElement("script");
          buttonScript.src = "https://www.mercadopago.com.br/integrations/v1/web-payment-checkout.js";
          buttonScript.setAttribute("data-preference-id", plan.preferenceId);
          buttonScript.setAttribute("data-source", "button");
          container.appendChild(buttonScript);
        }
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section id="planos" className="py-20 bg-background" aria-labelledby="plans-heading">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.h2
              id="plans-heading"
              className="text-4xl md:text-5xl font-bold mb-6 text-premium-gold"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              🌎 MUNDO PLAY TV
            </motion.h2>

            <motion.p
              className="text-lg text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Escolha seu plano e tenha acesso imediato ao melhor da TV mundial!
            </motion.p>
          </div>
          
          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                className={`
                  relative p-6 rounded-2xl border-t-4 border-premium-gold transition-all
                  bg-gradient-card shadow-card hover:shadow-gold
                  ${plan.popular ? 'ring-2 ring-premium-gold scale-105' : ''}
                `}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-gold text-accent-foreground px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      MAIS POPULAR
                    </div>
                  </div>
                )}
                
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2 text-premium-gold">
                    {plan.name}
                  </h3>
                  <p className="text-3xl font-bold text-foreground mb-2">
                    {plan.price}
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </p>
                </div>
                
                {/* Features List */}
                <ul className="text-sm mb-6 space-y-2">
                {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2 text-muted-foreground">
                      <Check className="w-5 h-5 text-premium-gold mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                {/* Mercado Pago Checkout Button */}
                <div 
                  ref={(el) => { containerRefs.current[index] = el; }}
                  className="w-full flex justify-center min-h-[48px]"
                />
              </motion.div>
            ))}
          </div>
          
          {/* Bottom Note */}
          <div className="text-center mt-8">
            <p className="text-muted-foreground text-sm">
              🔒 Pagamento 100% seguro • ⚡ Ativação imediata • 🎯 Teste grátis disponível
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Plans;