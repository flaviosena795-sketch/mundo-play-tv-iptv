import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WhatsAppButton = ({ className = "" }: { className?: string }) => {
  const whatsappLink = "https://wa.me/5521966238378";

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
      <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="w-5 h-5 mr-2" />
        Falar no WhatsApp
      </a>
    </Button>
  );
};

export default WhatsAppButton;