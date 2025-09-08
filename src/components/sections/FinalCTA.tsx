import WhatsAppButton from "@/components/WhatsAppButton";
import { Clock, Shield, Star } from "lucide-react";

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
                Pronto para começar sua <span className="text-premium-gold">experiência premium</span>?
              </h2>
              <p className="text-xl text-muted-foreground">
                Junte-se a mais de 5.000 famílias que já escolheram a melhor IPTV do Brasil.
                Entre em contato agora e configure seu plano em minutos!
              </p>
            </div>
            
            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="flex flex-col items-center gap-3 p-4">
                <div className="w-12 h-12 bg-premium-gold/10 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-premium-gold" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-foreground mb-1">Ativação Imediata</div>
                  <div className="text-sm text-muted-foreground">Configure em minutos</div>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-3 p-4">
                <div className="w-12 h-12 bg-premium-gold/10 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-premium-gold" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-foreground mb-1">Garantia Total</div>
                  <div className="text-sm text-muted-foreground">Satisfação garantida</div>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-3 p-4">
                <div className="w-12 h-12 bg-premium-gold/10 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-premium-gold" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-foreground mb-1">Teste Grátis</div>
                  <div className="text-sm text-muted-foreground">Experimente sem risco</div>
                </div>
              </div>
            </div>
            
            {/* CTA Button */}
            <div className="space-y-4">
              <WhatsAppButton className="text-lg px-8 py-4 shadow-gold" />
              <p className="text-sm text-muted-foreground">
                📱 WhatsApp: (21) 96623-8378 • Resposta em até 5 minutos
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