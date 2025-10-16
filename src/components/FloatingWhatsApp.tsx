import { MessageCircle } from "lucide-react";

const FloatingWhatsApp = () => {
  const whatsappLink = "https://wa.me/5521966238378?text=Olá! Gostaria de fazer um teste grátis de 6 horas.";

  const handleClick = () => {
    // GA4 Event Tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'whatsapp_click_floating', {
        'event_category': 'engagement',
        'event_label': 'Floating WhatsApp Button',
        'value': 1
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

export default FloatingWhatsApp;