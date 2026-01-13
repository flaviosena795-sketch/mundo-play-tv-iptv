import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const CONSENT_KEY = "cookie_consent";

type ConsentStatus = "accepted" | "declined" | null;

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(CONSENT_KEY) as ConsentStatus;
    if (!consent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setShowBanner(false);
    
    // Enable analytics if gtag is available
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setShowBanner(false);
    
    // Disable analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "denied",
      });
    }
  };

  if (!showBanner) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-fade-in-up"
      role="dialog"
      aria-label="Consentimento de cookies"
    >
      <div className="max-w-4xl mx-auto bg-card border border-subtle-border rounded-xl shadow-premium p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          {/* Icon and text */}
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 bg-accent/10 rounded-lg shrink-0">
              <Cookie className="w-5 h-5 text-accent" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-foreground font-medium">
                Utilizamos cookies para melhorar sua experiência
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Usamos cookies e tecnologias similares para análise de tráfego e personalização. 
                Ao continuar navegando, você concorda com nossa{" "}
                <Link 
                  to="/privacidade" 
                  className="text-accent hover:underline"
                >
                  Política de Privacidade
                </Link>.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecline}
              className="flex-1 md:flex-none text-xs border-subtle-border hover:bg-muted"
            >
              Recusar
            </Button>
            <Button
              size="sm"
              onClick={handleAccept}
              className="flex-1 md:flex-none text-xs bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Aceitar cookies
            </Button>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={handleDecline}
            className="absolute top-2 right-2 md:hidden p-1 text-muted-foreground hover:text-foreground transition-smooth"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
