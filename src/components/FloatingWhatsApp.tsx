import { MessageCircle } from "lucide-react";

const FloatingWhatsApp = () => {
  const whatsappLink = "https://wa.me/5521966238378?text=Olá!%20Gostaria%20de%20solicitar%20meu%20teste%20grátis%20de%205%20horas%20do%20Mundo%20Play%20TV.";

  const handleClick = () => {
    // GA4 event tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'whatsapp_floating_click', {
        event_category: 'engagement',
        event_label: 'WhatsApp Floating Button',
        value: 1
      });
    }
  };

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="
        fixed bottom-6 right-6 z-50
        bg-gradient-gold text-accent-foreground
        w-16 h-16 rounded-full
        flex items-center justify-center
        shadow-gold hover:shadow-premium
        hover:scale-110 transition-premium
        animate-pulse hover:animate-none
      "
      aria-label="Contato via WhatsApp"
    >
      <MessageCircle className="w-8 h-8" />
    </a>
  );
};

// Declare global gtag and fbq types
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

export default FloatingWhatsApp;