import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WhatsAppButtonProps {
  className?: string;
  children?: React.ReactNode;
  message?: string;
}

const WhatsAppButton = ({ className = "", children, message }: WhatsAppButtonProps) => {
  const defaultMessage = "Olá!%20Gostaria%20de%20solicitar%20meu%20teste%20grátis%20de%206%20horas%20do%20Mundo%20Play%20TV.";
  const whatsappLink = `https://wa.me/5521966238378?text=${message || defaultMessage}`;

  const handleClick = () => {
    // GA4 event tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'whatsapp_button_click', {
        event_category: 'engagement',
        event_label: 'WhatsApp CTA Button',
        value: 1
      });
    }
  };

  return (
    <Button
      asChild
      variant="default"
      className={`
        bg-gradient-gold text-accent-foreground 
        hover:shadow-gold hover:scale-105 
        transition-premium font-semibold
        shadow-lg border-0
        ${className}
      `}
    >
      <a 
        href={whatsappLink} 
        target="_blank" 
        rel="noopener noreferrer"
        onClick={handleClick}
      >
        <MessageCircle className="w-5 h-5 mr-2" />
        {children || "Falar no WhatsApp"}
      </a>
    </Button>
  );
};

// Declare global gtag and fbq types
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

export default WhatsAppButton;