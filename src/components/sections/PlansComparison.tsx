import { Check, X, Crown } from "lucide-react";
import WhatsAppButton from "@/components/WhatsAppButton";

const PlansComparison = () => {
  const plans = [
    {
      name: "Mensal",
      price: 29.9,
      pricePerMonth: 29.9,
      duration: "1 mês",
      savings: null,
      badge: null,
      features: {
        channels: "Todos os canais",
        quality: "4K Ultra HD",
        devices: "3 dispositivos",
        support: "Suporte 24/7",
        updates: "Atualizações automáticas",
        guarantee: "7 dias de garantia",
        vod: "Filmes e Séries",
        cancellation: "Cancelamento livre",
        flexibility: "Máxima flexibilidade",
        economy: null,
      }
    },
    {
      name: "Trimestral",
      price: 79.9,
      pricePerMonth: 26.63,
      duration: "3 meses",
      savings: "R$ 10,00",
      badge: "Popular",
      features: {
        channels: "Todos os canais",
        quality: "4K Ultra HD",
        devices: "3 dispositivos",
        support: "Suporte 24/7",
        updates: "Atualizações automáticas",
        guarantee: "7 dias de garantia",
        vod: "Filmes e Séries",
        cancellation: "Cancelamento livre",
        flexibility: "Boa economia",
        economy: "11% de desconto",
      }
    },
    {
      name: "Semestral",
      price: 179.9,
      pricePerMonth: 29.98,
      duration: "6 meses",
      savings: null,
      badge: null,
      features: {
        channels: "Todos os canais",
        quality: "4K Ultra HD",
        devices: "3 dispositivos",
        support: "Suporte 24/7",
        updates: "Atualizações automáticas",
        guarantee: "7 dias de garantia",
        vod: "Filmes e Séries",
        cancellation: "Cancelamento livre",
        flexibility: "Boa flexibilidade",
        economy: null,
      }
    },
    {
      name: "Anual",
      price: 289.9,
      pricePerMonth: 24.16,
      duration: "12 meses",
      savings: "R$ 68,90",
      badge: "Melhor Valor",
      features: {
        channels: "Todos os canais",
        quality: "4K Ultra HD",
        devices: "3 dispositivos",
        support: "Suporte 24/7",
        updates: "Atualizações automáticas",
        guarantee: "7 dias de garantia",
        vod: "Filmes e Séries",
        cancellation: "Cancelamento livre",
        flexibility: "Máxima economia",
        economy: "19% de desconto",
      }
    },
  ];

  const featureLabels = {
    channels: "Canais Disponíveis",
    quality: "Qualidade de Imagem",
    devices: "Dispositivos Simultâneos",
    support: "Suporte ao Cliente",
    updates: "Atualizações de Conteúdo",
    guarantee: "Garantia de Reembolso",
    vod: "VOD (On Demand)",
    cancellation: "Cancelamento",
    flexibility: "Flexibilidade",
    economy: "Economia Total",
  };

  return (
    <section id="comparativo" className="py-16 bg-gradient-to-b from-accent/10 to-background" aria-labelledby="comparison-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 id="comparison-heading" className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            📊 Compare Nossos <span className="text-premium-gold">Planos</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Escolha o plano ideal para você. Quanto mais tempo, maior a economia!
          </p>
        </div>

        {/* Mobile View - Cards */}
        <div className="lg:hidden space-y-6 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-gradient-card rounded-2xl p-6 border ${
                plan.badge === "Melhor Valor" 
                  ? "border-premium-gold shadow-gold" 
                  : "border-premium-gold/30"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.duration}</p>
                </div>
                {plan.badge && (
                  <span className="bg-gradient-gold text-accent-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    {plan.badge === "Melhor Valor" && <Crown className="w-3 h-3" />}
                    {plan.badge}
                  </span>
                )}
              </div>

              <div className="mb-4">
                <div className="text-3xl font-bold text-premium-gold">
                  R$ {plan.price.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  R$ {plan.pricePerMonth.toFixed(2)}/mês
                </div>
                {plan.savings && (
                  <div className="text-sm text-green-500 font-semibold mt-1">
                    💰 Economize {plan.savings}
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-6">
                {Object.entries(plan.features).map(([key, value]) => (
                  value && (
                    <div key={key} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-premium-gold flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-xs text-muted-foreground">
                          {featureLabels[key as keyof typeof featureLabels]}
                        </div>
                        <div className="text-sm font-medium text-foreground">{value}</div>
                      </div>
                    </div>
                  )
                ))}
              </div>

              <WhatsAppButton
                className="w-full justify-center"
                message={`Olá!%20Gostaria%20de%20assinar%20o%20Plano%20${plan.name}%20(R$%20${plan.price.toFixed(2)}).`}
              >
                Assinar Plano {plan.name}
              </WhatsAppButton>
            </div>
          ))}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-4 text-left bg-gradient-card border border-premium-gold/30 rounded-tl-xl">
                  <span className="text-lg font-bold text-foreground">Características</span>
                </th>
                {plans.map((plan, index) => (
                  <th
                    key={plan.name}
                    className={`p-4 text-center bg-gradient-card border border-premium-gold/30 ${
                      index === plans.length - 1 ? "rounded-tr-xl" : ""
                    } ${plan.badge === "Melhor Valor" ? "border-premium-gold border-2" : ""}`}
                  >
                    <div className="space-y-2">
                      {plan.badge && (
                        <span className="inline-block bg-gradient-gold text-accent-foreground text-xs font-bold px-3 py-1 rounded-full mb-2">
                          {plan.badge === "Melhor Valor" && <Crown className="w-3 h-3 inline mr-1" />}
                          {plan.badge}
                        </span>
                      )}
                      <div className="text-xl font-bold text-foreground">{plan.name}</div>
                      <div className="text-sm text-muted-foreground">{plan.duration}</div>
                      <div className="text-2xl font-bold text-premium-gold">
                        R$ {plan.price.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        R$ {plan.pricePerMonth.toFixed(2)}/mês
                      </div>
                      {plan.savings && (
                        <div className="text-xs text-green-500 font-semibold">
                          💰 Economize {plan.savings}
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(featureLabels).map(([key, label], rowIndex) => (
                <tr key={key} className="hover:bg-accent/5 transition-colors">
                  <td className="p-4 font-medium text-foreground bg-gradient-card border border-premium-gold/30">
                    {label}
                  </td>
                  {plans.map((plan, colIndex) => {
                    const value = plan.features[key as keyof typeof plan.features];
                    const isHighlighted = plan.badge === "Melhor Valor";
                    
                    return (
                      <td
                        key={`${plan.name}-${key}`}
                        className={`p-4 text-center bg-gradient-card border ${
                          isHighlighted ? "border-premium-gold border-2" : "border-premium-gold/30"
                        }`}
                      >
                        {value ? (
                          <div className="flex items-center justify-center gap-2">
                            <Check className="w-5 h-5 text-premium-gold" />
                            <span className={`text-sm ${key === 'economy' ? 'font-bold text-green-500' : 'text-muted-foreground'}`}>
                              {value}
                            </span>
                          </div>
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground/30 mx-auto" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr>
                <td className="p-4 bg-gradient-card border border-premium-gold/30 rounded-bl-xl"></td>
                {plans.map((plan, index) => (
                  <td
                    key={`${plan.name}-cta`}
                    className={`p-4 bg-gradient-card border ${
                      plan.badge === "Melhor Valor" ? "border-premium-gold border-2" : "border-premium-gold/30"
                    } ${index === plans.length - 1 ? "rounded-br-xl" : ""}`}
                  >
                    <WhatsAppButton
                      className="w-full justify-center text-sm py-2"
                      message={`Olá!%20Gostaria%20de%20assinar%20o%20Plano%20${plan.name}%20(R$%20${plan.price.toFixed(2)}).`}
                    >
                      Assinar
                    </WhatsAppButton>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            ✨ Todos os planos incluem os mesmos recursos premium • 🔒 Garantia de 7 dias • ⚡ Ativação imediata
          </p>
        </div>
      </div>
    </section>
  );
};

export default PlansComparison;
