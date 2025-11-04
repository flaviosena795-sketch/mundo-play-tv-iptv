import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, CreditCard } from "lucide-react";

const PagamentoPix = () => {
  const [nome, setNome] = useState("");

  const linkPix = "https://mpago.la/1xVXUV1";
  const emailPix = "mundoplaytv82@gmail.com";
  const whatsappLink = `https://wa.me/5521966238378?text=Olá!%20Sou%20${encodeURIComponent(
    nome
  )}%20e%20acabei%20de%20realizar%20o%20pagamento%20via%20Pix.%20Enviei%20o%20comprovante%20para%20${emailPix}.`;

  return (
    <section
      id="pagamento"
      className="py-16 bg-gradient-to-b from-background via-accent/10 to-background text-center"
      aria-labelledby="pagamento-heading"
    >
      <div className="max-w-xl mx-auto px-6">
        <h2 id="pagamento-heading" className="text-3xl md:text-4xl font-bold mb-4 text-premium-gold">
          💳 Pagamento via Pix
        </h2>
        <p className="text-muted-foreground mb-8">
          Digite seu nome completo antes de efetuar o pagamento. <br />
          Após pagar, envie o comprovante no WhatsApp para nossa equipe confirmar sua ativação.
        </p>

        <input
          type="text"
          placeholder="Digite seu nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full p-3 rounded-lg mb-4 bg-card text-foreground border border-subtle-border focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-premium-gold transition-smooth"
          aria-label="Nome completo"
        />

        <a
          href={linkPix}
          target="_blank"
          rel="noopener noreferrer"
          className="block mb-4"
        >
          <Button className="w-full gradient-gold text-accent-foreground hover:shadow-gold hover:scale-105 transition-premium shadow-lg">
            <CreditCard className="w-5 h-5 mr-2" />
            Fazer Pagamento Pix
          </Button>
        </a>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button
            className="w-full bg-[#25D366] text-white hover:bg-[#1fb855] transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!nome}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Enviar Comprovante no WhatsApp
          </Button>
        </a>

        <p className="text-sm text-muted-foreground mt-6">
          🔒 Pagamento 100% seguro | ⚡ Ativação imediata | 💬 Suporte 24h
        </p>
      </div>
    </section>
  );
};

export default PagamentoPix;
