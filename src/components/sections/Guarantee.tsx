import WhatsAppButton from "@/components/WhatsAppButton";
import { Shield } from "lucide-react";

const Guarantee = () => {
  return (
    <section id="garantia" className="py-16 bg-gradient-to-b from-background to-accent/10" aria-labelledby="guarantee-heading">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-card rounded-3xl p-10 border border-premium-gold/30 shadow-card">
            <div className="flex justify-center mb-6">
              <Shield className="w-16 h-16 text-premium-gold" />
            </div>
            
            <h2 id="guarantee-heading" className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              🛡️ Garantia Total de <span className="text-premium-gold">7 Dias</span>
            </h2>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Assine com tranquilidade! Aproveite todos os canais, filmes e séries por até 7 dias.
              Caso não fique satisfeito por qualquer motivo, <strong className="text-foreground">devolvemos 100% do seu dinheiro</strong> — sem burocracia, sem enrolação.
            </p>
            
            <WhatsAppButton 
              className="text-lg px-10 py-6 h-auto font-bold"
              message="Olá!%20Tenho%20dúvidas%20sobre%20a%20garantia%20de%207%20dias."
            >
              💬 Falar no WhatsApp
            </WhatsAppButton>
            
            <p className="mt-6 text-muted-foreground">
              💰 <em>Teste sem risco — Satisfação garantida ou seu dinheiro de volta.</em>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Guarantee;
