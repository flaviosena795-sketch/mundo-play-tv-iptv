import { Check, Star } from "lucide-react";
import WhatsAppButton from "@/components/WhatsAppButton";

const Plans = () => {
  const plans = [
    {
      name: "Básico",
      price: "R$ 29,90",
      period: "/mês",
      description: "Ideal para quem quer começar",
      features: [
        "Mais de 5.000 canais",
        "Qualidade Full HD",
        "2 dispositivos simultâneos",
        "Suporte por chat",
        "Filmes e séries",
      ],
      popular: false,
    },
    {
      name: "Premium",
      price: "R$ 49,90",
      period: "/mês",
      description: "Nosso plano mais popular",
      features: [
        "Mais de 15.000 canais",
        "Qualidade 4K Ultra HD",
        "5 dispositivos simultâneos",
        "Suporte prioritário 24/7",
        "Filmes, séries e PPV",
        "Canais adultos",
        "Lista IPTV personalizada",
      ],
      popular: true,
    },
    {
      name: "Elite",
      price: "R$ 79,90",
      period: "/mês",
      description: "Para quem não abre mão do melhor",
      features: [
        "Mais de 25.000 canais",
        "Qualidade 4K Ultra HD",
        "Dispositivos ilimitados",
        "Suporte VIP exclusivo",
        "Todos os recursos Premium",
        "Acesso a eventos especiais",
        "Instalação e configuração",
        "Garantia estendida",
      ],
      popular: false,
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Escolha seu <span className="text-premium-gold">Plano Ideal</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Temos opções para todos os perfis. Todos os planos incluem teste grátis 
              e garantia de satisfação.
            </p>
          </div>
          
          {/* Plans Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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