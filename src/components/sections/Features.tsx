import { Shield, Zap, Headphones, Smartphone, Tv, Crown } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Tv,
      title: "📺 Canais Premium",
      description: "Nacionais e internacionais em alta definição",
    },
    {
      icon: Crown,
      title: "🎬 +50.000 Conteúdos",
      description: "Filmes, séries, PPV e muito mais",
    },
    {
      icon: Zap,
      title: "⚙ Estabilidade Garantida",
      description: "Servidores premium com 99,9% de uptime",
    },
    {
      icon: Headphones,
      title: "📲 Suporte 24/7",
      description: "Atendimento técnico disponível a qualquer hora",
    },
    {
      icon: Smartphone,
      title: "💻 Multiplataforma",
      description: "Smart TV, celular, PC, tablet e TV Box",
    },
    {
      icon: Shield,
      title: "🎯 Qualidade 4K Ultra HD",
      description: "Imagem perfeita e áudio cristalino",
    },
  ];

  return (
    <section className="py-20 bg-darker-bg">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              🚀 Por que escolher a <span className="text-premium-gold">Mundo Play TV</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Descubra as vantagens exclusivas que fazem da nossa plataforma 
              a escolha ideal para seu entretenimento.
            </p>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="
                    group p-8 bg-gradient-card rounded-2xl border border-subtle-border 
                    hover:shadow-card hover:border-premium-gold/20 transition-premium
                  "
                >
                  <div className="
                    w-16 h-16 bg-premium-gold/10 rounded-2xl flex items-center justify-center 
                    mb-6 group-hover:bg-premium-gold/20 transition-premium
                  ">
                    <IconComponent className="w-8 h-8 text-premium-gold" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 text-foreground group-hover:text-premium-gold transition-smooth">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
          
          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-2 bg-premium-gold/10 px-6 py-3 rounded-full border border-premium-gold/20">
              <div className="w-2 h-2 bg-premium-gold rounded-full animate-pulse"></div>
              <span className="text-premium-gold font-medium">
                Experimente agora e comprove a diferença
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;