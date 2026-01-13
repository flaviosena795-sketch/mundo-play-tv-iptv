import { Check, Star, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Preload Mercado Pago SDK when user hovers on plans section
const preloadMercadoPagoSDK = () => {
  if (document.querySelector('script[src*="mercadopago"]')) return;
  
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = 'https://sdk.mercadopago.com';
  document.head.appendChild(link);
};

// Whitelist of allowed MercadoPago redirect domains
const ALLOWED_PAYMENT_DOMAINS = [
  'mercadopago.com',
  'mercadopago.com.br',
  'mercadopago.com.ar',
  'mercadopago.com.mx',
  'mercadopago.cl',
  'mercadopago.co',
  'mercadopago.pe',
  'mercadolibre.com',
];

// Validate that URL is from a trusted MercadoPago domain
const isValidPaymentUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();
    
    // Check if hostname ends with any of the allowed domains
    return ALLOWED_PAYMENT_DOMAINS.some(domain => 
      hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
};

// Format phone number as (00) 00000-0000
const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const Plans = () => {
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const plans = [
    {
      name: "Mensal",
      price: "R$ 29,90",
      valor: 29.9,
      period: "/mês",
      features: [
        "+15.000 canais",
        "Qualidade 4K Ultra HD",
        "Filmes, séries e PPV",
        "Suporte 24/7",
      ],
      popular: false,
    },
    {
      name: "Trimestral",
      price: "R$ 79,90",
      valor: 79.9,
      period: "/3 meses",
      features: [
        "+15.000 canais",
        "4K Ultra HD",
        "Filmes, séries e PPV",
        "Suporte 24/7",
      ],
      popular: true,
    },
    {
      name: "Semestral",
      price: "R$ 149,90",
      valor: 149.9,
      period: "/6 meses",
      features: [
        "+15.000 canais",
        "4K Ultra HD",
        "Filmes, séries e PPV",
        "Suporte 24/7",
      ],
      popular: false,
    },
    {
      name: "Anual",
      price: "R$ 289,90",
      valor: 289.9,
      period: "/ano",
      features: [
        "+15.000 canais",
        "4K Ultra HD",
        "Filmes, séries e PPV",
        "Suporte 24/7",
      ],
      popular: false,
    },
  ];

  const handleSelectPlan = (plan: typeof plans[0]) => {
    setSelectedPlan(plan);
    setDialogOpen(true);
    
    // GA4 event tracking - plan selection
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'select_plan', {
        event_category: 'conversion',
        event_label: plan.name,
        value: plan.valor,
        currency: 'BRL',
        plan_name: plan.name,
        plan_price: plan.valor
      });
    }
  };

  const handlePayment = async () => {
    if (!selectedPlan) return;
    
    const trimmedName = clientName.trim();
    const trimmedPhone = clientPhone.trim();
    
    if (!trimmedName) {
      toast.error("Por favor, informe seu nome completo");
      return;
    }

    if (!trimmedPhone) {
      toast.error("Por favor, informe seu WhatsApp");
      return;
    }

    // Validate name length
    if (trimmedName.length < 3 || trimmedName.length > 100) {
      toast.error("Nome deve ter entre 3 e 100 caracteres");
      return;
    }

    // Validate phone (basic check)
    if (trimmedPhone.length < 10 || trimmedPhone.length > 20) {
      toast.error("WhatsApp inválido");
      return;
    }

    setIsLoading(true);

    // Save data locally for success page redirect
    localStorage.setItem('mp_full_name', trimmedName);
    localStorage.setItem('mp_phone', trimmedPhone);
    localStorage.setItem('mp_plan', selectedPlan.name);

    try {
      const { data, error } = await supabase.functions.invoke('criar-preferencia', {
        body: {
          plano: { nome: selectedPlan.name },
          clientName: trimmedName,
          clientPhone: trimmedPhone
        }
      });

      if (error) {
        console.error("Erro ao criar preferência:", error);
        toast.error("Erro ao processar. Tente novamente.");
        return;
      }

      if (data?.init_point) {
        // Validate the URL is from a trusted MercadoPago domain
        if (!isValidPaymentUrl(data.init_point)) {
          console.error("URL de pagamento não confiável:", data.init_point);
          toast.error("Erro de segurança. Tente novamente.");
          return;
        }
        
        // GA4 event tracking - begin checkout
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'begin_checkout', {
            event_category: 'conversion',
            event_label: selectedPlan.name,
            value: selectedPlan.valor,
            currency: 'BRL',
            plan_name: selectedPlan.name,
            items: [{
              item_id: selectedPlan.name.toLowerCase().replace(' ', '_'),
              item_name: `Plano ${selectedPlan.name}`,
              price: selectedPlan.valor,
              quantity: 1
            }]
          });
        }
        
        // Redirect to Mercado Pago checkout
        window.location.href = data.init_point;
      } else {
        toast.error("Erro ao iniciar pagamento. Tente novamente.");
      }
    } catch (err) {
      console.error("Erro:", err);
      toast.error("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="planos" className="py-20 bg-background" aria-labelledby="plans-heading" onMouseEnter={preloadMercadoPagoSDK}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2
              id="plans-heading"
              className="text-4xl md:text-5xl font-bold mb-6 text-premium-gold animate-fade-in"
            >
              🌎 MUNDO PLAY TV
            </h2>

            <p
              className="text-lg text-muted-foreground animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Escolha seu plano e tenha acesso imediato ao melhor da TV mundial!
            </p>
          </div>
          
          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`
                  relative p-6 rounded-2xl border-t-4 border-premium-gold transition-all
                  bg-gradient-card shadow-card hover:shadow-gold animate-fade-in-up
                  ${plan.popular ? 'ring-2 ring-premium-gold scale-105' : ''}
                `}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-gold text-accent-foreground px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      MAIS POPULAR
                    </div>
                  </div>
                )}
                
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2 text-premium-gold">
                    {plan.name}
                  </h3>
                  <p className="text-3xl font-bold text-foreground mb-2">
                    {plan.price}
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </p>
                </div>
                
                {/* Features List */}
                <ul className="text-sm mb-6 space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2 text-muted-foreground">
                      <Check className="w-5 h-5 text-premium-gold mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                {/* Subscribe Button */}
                <Button 
                  onClick={() => handleSelectPlan(plan)}
                  className="w-full bg-gradient-gold hover:opacity-90 text-accent-foreground font-bold"
                >
                  Assinar Agora
                </Button>
              </div>
            ))}
          </div>
          
          {/* Bottom Note */}
          <div className="text-center mt-8">
            <p className="text-muted-foreground text-sm">
              🔒 Pagamento 100% seguro • ⚡ Ativação imediata • 🎯 Teste grátis disponível
            </p>
          </div>
        </div>
      </div>

      {/* Name Input Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-premium-gold">
              Finalizar Compra - Plano {selectedPlan?.name}
            </DialogTitle>
            <DialogDescription>
              Informe seu nome completo para prosseguir com o pagamento de {selectedPlan?.price}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="clientName" className="text-sm font-medium">
                Nome Completo <span className="text-red-500">*</span>
              </label>
              <Input
                id="clientName"
                placeholder="Digite seu nome completo"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                maxLength={100}
                disabled={isLoading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="clientPhone" className="text-sm font-medium">
                WhatsApp <span className="text-red-500">*</span>
              </label>
              <Input
                id="clientPhone"
                placeholder="(00) 00000-0000"
                value={clientPhone}
                onChange={(e) => setClientPhone(formatPhone(e.target.value))}
                maxLength={16}
                disabled={isLoading}
                required
              />
            </div>
            
            <Button 
              onClick={handlePayment}
              disabled={isLoading || !clientName.trim() || !clientPhone.trim()}
              className="w-full bg-gradient-gold hover:opacity-90 text-accent-foreground font-bold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                "Pagar Agora"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
  </section>
  );
};

// Declare global gtag type
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default Plans;
