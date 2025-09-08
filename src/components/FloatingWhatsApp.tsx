import { MessageCircle } from "lucide-react";

const FloatingWhatsApp = () => {
  const whatsappLink = "https://wa.me/5521966238378";

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
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