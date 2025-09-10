import { Check, Star } from "lucide-react";
import WhatsAppButton from "@/components/WhatsAppButton";

const Plans = () => {
  const plans = [
    {
      name: "Mundo Play TV",
      price: "R$ 29,90",
      period: "/mês",
      description: "O melhor da TV mundial na sua casa",
      features: [
        "Mais de 15.000 canais",
        "Qualidade 4K Ultra HD",
        "Suporte 24/7",
        "Filmes, séries e PPV",
        "Canais do mundo inteiro",
        "Lista IPTV personalizada",
        "Teste grátis disponível",
        "Ativação imediata",
      ],
      popular: true,
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-premium-gold">Mundo Play TV</span>
            </h2>
          </div>
          
          {/* Plans Grid */}
          <div className="flex justify-center">
            <div className="max-w-md w-full">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`
                  relative p-8 rounded-2xl border transition-premium
                  ${plan.popular 
                    ? 'border-premium-gold bg-gradient-card shadow-gold scale-105' 
                    : 'border-subtle-border bg-gradient-card hover:border-premium-gold/20 hover:shadow-card'
                  }
                `}
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
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2 text-foreground">{plan.name}</h3>
                  <p className="text-muted-foreground mb-4">{plan.description}</p>
                  <div className="flex items-center justify-center">
                    <span className="text-4xl font-bold text-premium-gold">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">{plan.period}</span>
                  </div>
                </div>
                
                {/* Features List */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-premium-gold mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {/* CTA Button */}
                <WhatsAppButton 
                  className={`
                    w-full justify-center
                    ${plan.popular ? 'shadow-gold' : ''}
                  `} 
                />
              </div>
            ))}
            </div>
          </div>
          
          {/* Bottom Note */}
          <div className="text-center mt-12">
            <p className="text-muted-foreground">
              🔒 Pagamento 100% seguro • ⚡ Ativação imediata • 🎯 Teste grátis disponível
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Plans;