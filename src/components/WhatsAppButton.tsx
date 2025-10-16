import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WhatsAppButtonProps {
  className?: string;
  children?: React.ReactNode;
}

const WhatsAppButton = ({ className = "", children }: WhatsAppButtonProps) => {
  const whatsappLink = "https://wa.me/5521966238378?text=Olá! Gostaria de fazer um teste grátis de 6 horas.";

  const handleClick = () => {
    // GA4 Event Tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'whatsapp_click', {
        'event_category': 'engagement',
        'event_label': children || 'Falar no WhatsApp',
        'value': 1
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

export default WhatsAppButton;