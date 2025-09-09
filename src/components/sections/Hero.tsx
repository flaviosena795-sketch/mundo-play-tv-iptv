import WhatsAppButton from "@/components/WhatsAppButton";
import heroImage from "@/assets/hero-iptv.jpg";
import { Play, Shield, Clock } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Brand Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-card px-4 py-2 rounded-full border border-subtle-border mb-8">
            <div className="w-2 h-2 bg-premium-gold rounded-full animate-pulse"></div>
            <span className="text-premium-gold font-medium text-sm">🎬 IPTV Premium com Qualidade 4K</span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-foreground">Mundo</span>
            <span className="text-premium-gold"> Play</span>
            <span className="text-foreground"> TV</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Entretenimento sem limites com <span className="text-premium-gold font-semibold">+50.000 conteúdos</span> ao vivo e sob demanda.<br />
            <span className="text-premium-gold font-semibold">Suporte 24h, estabilidade garantida e ativação imediata.</span>
          </p>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="flex items-center justify-center gap-3 p-4 bg-gradient-card rounded-lg border border-subtle-border">
              <Play className="w-6 h-6 text-premium-gold" />
              <span className="font-medium">4K Ultra HD</span>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-gradient-card rounded-lg border border-subtle-border">
              <Shield className="w-6 h-6 text-premium-gold" />
              <span className="font-medium">99.9% Estabilidade</span>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-gradient-card rounded-lg border border-subtle-border">
              <Clock className="w-6 h-6 text-premium-gold" />
              <span className="font-medium">Suporte 24h</span>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <WhatsAppButton className="text-lg px-8 py-4" />
            <button className="text-premium-gold hover:text-accent transition-smooth font-medium">
              Ver demonstração →
            </button>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default Hero;