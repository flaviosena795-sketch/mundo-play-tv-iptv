import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, CreditCard, Shield, Zap, Headphones } from "lucide-react";

const Pagamento = () => {
  const [nome, setNome] = useState("");

  const linkPagamento = "https://mpago.la/1xVXUV1";
  const email = "mundoplaytv82@gmail.com";

  const whatsappLink = `https://wa.me/5521966238378?text=Olá!%20meu%20nome%20é%20${encodeURIComponent(
    nome
  )}%20e%20realizei%20o%20pagamento.%20Já%20enviei%20o%20comprovante%20para%20${email}.`;

  return (
    <section className="py-16 bg-gradient-to-b from-background to-accent/20" aria-labelledby="pagamento-heading">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-card rounded-2xl p-8 shadow-card border border-subtle-border">
            <h2 id="pagamento-heading" className="text-2xl md:text-3xl font-bold mb-4 text-center">
              <span className="text-premium-gold">💳 Pagamento</span>
            </h2>

            <p className="text-muted-foreground mb-6 text-center">
              Digite seu nome completo antes de realizar o pagamento.
              <br />
              Após pagar, envie o comprovante no WhatsApp.
            </p>

            <input
              type="text"
              placeholder="Digite seu nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full p-3 rounded-lg mb-4 bg-background border border-subtle-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent transition-all"
            />

            <a href={linkPagamento} target="_blank" rel="noopener noreferrer">
              <Button className="w-full mb-4 h-12 text-base">
                <CreditCard className="w-5 h-5 mr-2" />
                Fazer Pagamento
              </Button>
            </a>

            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button
                className="w-full h-12 text-base bg-green-600 hover:bg-green-700 text-white"
                disabled={!nome}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Enviar Comprovante no WhatsApp
              </Button>
            </a>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground mt-6">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-premium-gold" />
                <span>Pagamento seguro</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-premium-gold" />
                <span>Ativação rápida</span>
              </div>
              <div className="flex items-center gap-1">
                <Headphones className="w-4 h-4 text-premium-gold" />
                <span>Suporte 24h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pagamento;
