import { Shield, Zap, Headphones, Smartphone, Tv, Crown, Play } from "lucide-react";
import soccerPlayer from "@/assets/soccer-player.webp";

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
    <section id="recursos" className="py-20 bg-darker-bg" aria-labelledby="features-heading">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 id="features-heading" className="text-4xl md:text-5xl font-bold mb-6">
              🚀 Por que escolher a <span className="text-premium-gold">Mundo Play TV</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Descubra as vantagens exclusivas que fazem da nossa plataforma 
              a escolha ideal para seu entretenimento.
            </p>
          </div>

          {/* Sports Live Banner */}
          <div className="relative mb-16 overflow-hidden rounded-3xl bg-gradient-to-r from-premium-gold/10 via-background to-premium-gold/5 border border-premium-gold/20">
            <div className="grid md:grid-cols-2 items-center">
              {/* Content */}
              <div className="p-8 md:p-12 z-10">
                <div className="inline-flex items-center gap-2 bg-red-500/20 px-4 py-2 rounded-full mb-6">
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                  <span className="text-red-400 font-semibold text-sm uppercase tracking-wide">Ao Vivo</span>
                </div>
                
                <h3 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                  ⚽ Não perca seu time jogar e{" "}
                  <span className="text-premium-gold">nem uma outra partida!</span>
                </h3>
                
                <p className="text-lg text-muted-foreground mb-8 max-w-md">
                  Assista a todos os jogos do seu time e campeonatos ao vivo, em qualidade 4K, 
                  sem travamentos. Futebol, UFC, NBA, F1 e muito mais!
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://wa.me/5521966238378?text=Olá!%20Quero%20assistir%20esportes%20ao%20vivo!"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-premium-gold text-black font-bold px-6 py-3 rounded-full hover:bg-premium-gold-hover transition-premium shadow-lg shadow-premium-gold/25"
                  >
                    <Play className="w-5 h-5" fill="currentColor" />
                    Assista Agora
                  </a>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="px-3 py-1.5 bg-muted/50 rounded-full">🏆 Brasileirão</span>
                    <span className="px-3 py-1.5 bg-muted/50 rounded-full">⚽ Champions</span>
                    <span className="px-3 py-1.5 bg-muted/50 rounded-full">🥊 UFC</span>
                  </div>
                </div>
              </div>
              
              {/* Image */}
              <div className="relative h-64 md:h-full min-h-[300px]">
                <img
                  src={soccerPlayer}
                  alt="Jogador de futebol em ação - assista esportes ao vivo"
                  className="absolute bottom-0 right-0 h-full w-auto max-w-none object-contain object-right-bottom md:scale-110 md:-right-8"
                  loading="lazy"
                />
                {/* Gradient overlay for mobile */}
                <div className="absolute inset-0 bg-gradient-to-t from-darker-bg via-transparent to-transparent md:hidden"></div>
              </div>
            </div>
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
            <a 
              href="https://wa.me/5521966238378" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-premium-gold/10 px-6 py-3 rounded-full border border-premium-gold/20 hover:bg-premium-gold/20 transition-premium cursor-pointer"
            >
              <div className="w-2 h-2 bg-premium-gold rounded-full animate-pulse"></div>
              <span className="text-premium-gold font-medium">
                Experimente agora e comprove a diferença
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;