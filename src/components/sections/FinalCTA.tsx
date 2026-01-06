import WhatsAppButton from "@/components/WhatsAppButton";
import { Clock, Shield, Star, MessageCircle, Instagram, Facebook } from "lucide-react";
import playIcon from "@/assets/play-icon.png";

const FinalCTA = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main CTA */}
          <div className="bg-gradient-card rounded-3xl border border-subtle-border p-8 md:p-12 shadow-premium">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                💬 <span className="text-premium-gold">Fale com um Especialista</span> Agora
              </h2>
              <p className="text-xl text-muted-foreground">
                Tire dúvidas, agende sua instalação ou solicite seu teste grátis via WhatsApp.
              </p>
            </div>
            
            {/* Teste Grátis Section */}
            <div className="bg-premium-gold/5 rounded-2xl p-8 mb-8 border border-premium-gold/20">
              <h3 className="text-2xl font-bold text-premium-gold mb-4">
                🎁 Teste Grátis por 12 horas
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                Experimente agora, sem compromisso.<br />
                Ativação imediata e suporte completo.
              </p>
              
              <WhatsAppButton className="text-lg px-8 py-4 shadow-gold mb-4">
                📲 Quero Testar Grátis
              </WhatsAppButton>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/5521966238378"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex items-center justify-center gap-2
                    bg-green-500 hover:bg-green-600 text-white
                    px-8 py-4 rounded-lg font-semibold text-lg
                    shadow-lg hover:shadow-xl transform hover:scale-105
                    transition-all duration-300
                  "
                >
                  <img src={playIcon} alt="Play" className="w-6 h-6" />
                  💬 Falar no WhatsApp
                </a>
                
                <a
                  href="https://bit.ly/instamundoplaytv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex items-center justify-center gap-2
                    bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white
                    px-8 py-4 rounded-lg font-semibold text-lg
                    shadow-lg hover:shadow-xl transform hover:scale-105
                    transition-all duration-300
                  "
                >
                  <Instagram className="w-6 h-6" />
                  📸 Seguir no Instagram
                </a>
                
                <a
                  href="http://bit.ly/47Ktf3y"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex items-center justify-center gap-2
                    bg-blue-600 hover:bg-blue-700 text-white
                    px-8 py-4 rounded-lg font-semibold text-lg
                    shadow-lg hover:shadow-xl transform hover:scale-105
                    transition-all duration-300
                  "
                >
                  <Facebook className="w-6 h-6" />
                  👍 Curtir no Facebook
                </a>
              </div>
              
              <p className="text-muted-foreground text-lg">
                📧 contato@mundoplaytv.com.br<br />
                📞 (21) 96623-8378
              </p>
            </div>
          </div>
          
          {/* Additional Info */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="bg-gradient-card rounded-2xl border border-subtle-border p-6">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-premium-gold rounded-full"></div>
                Instalação Simples
              </h3>
              <p className="text-muted-foreground text-sm">
                Nossos técnicos fazem toda a configuração remotamente. 
                Você só precisa ter uma TV Smart ou dispositivo compatível.
              </p>
            </div>
            
            <div className="bg-gradient-card rounded-2xl border border-subtle-border p-6">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-premium-gold rounded-full"></div>
                Suporte Especializado
              </h3>
              <p className="text-muted-foreground text-sm">
                Equipe técnica disponível 24/7 para resolver qualquer dúvida 
                ou problema. Atendimento rápido e eficiente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;