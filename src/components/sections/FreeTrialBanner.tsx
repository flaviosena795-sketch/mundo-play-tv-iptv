import { Clock, Gift } from "lucide-react";
import WhatsAppButton from "@/components/WhatsAppButton";

const FreeTrialBanner = () => {
  return (
    <section id="teste-gratis" className="py-16 bg-gradient-to-r from-premium-gold/10 via-premium-gold/5 to-transparent border-y border-premium-gold/20" aria-labelledby="free-trial-heading">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center items-center gap-4 mb-6">
            <Gift className="w-12 h-12 text-premium-gold animate-pulse" />
            <Clock className="w-12 h-12 text-premium-gold" />
          </div>
          
          <div className="mb-8">
            <h2 id="free-trial-heading" className="text-5xl md:text-6xl font-bold mb-4">
              <span className="text-premium-gold">5 horas</span> exclusivas
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-foreground">
              para o seu <span className="text-premium-gold">Teste GRÁTIS</span>
            </h3>
          </div>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Experimente nossa plataforma premium sem compromisso. 
            Acesso completo a todos os canais em qualidade 4K por 5 horas inteiras!
          </p>
          
          {/* Vídeo demonstrativo */}
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="aspect-video bg-darker-bg rounded-xl overflow-hidden border border-premium-gold/20">
              <video
                src="/assets/free-trial-video.mp4"
                title="Demonstração do Teste Grátis"
                className="w-full h-full object-cover"
                controls
                preload="metadata"
              >
                Seu navegador não suporta vídeos HTML5.
              </video>
            </div>
          </div>
          
          <div className="bg-gradient-card rounded-2xl p-8 border border-premium-gold/30 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-premium-gold mb-2">+10.000</div>
                <div className="text-sm text-muted-foreground">Canais Disponíveis</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-premium-gold mb-2">4K</div>
                <div className="text-sm text-muted-foreground">Ultra HD Quality</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-premium-gold mb-2">0</div>
                <div className="text-sm text-muted-foreground">Custo no Teste</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <WhatsAppButton className="text-xl px-12 py-6 h-auto font-bold" />
            <p className="text-sm text-muted-foreground">
              ⚡ Ativação imediata • 🔒 Sem compromisso • 💯 Satisfação garantida
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreeTrialBanner;