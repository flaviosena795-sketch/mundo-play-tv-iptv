import paymentMethodsImage from "@/assets/payment-methods.png";
import WhatsAppButton from "@/components/WhatsAppButton";

const PaymentMethods = () => {
  return (
    <section className="py-16 bg-accent/20" aria-labelledby="payment-heading">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 id="payment-heading" className="text-3xl md:text-4xl font-bold mb-8 text-foreground">
            Formas de <span className="text-premium-gold">Pagamento</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-12">
            Oferecemos diversas opções de pagamento para sua comodidade e segurança
          </p>
          
          <div className="bg-card rounded-2xl p-8 shadow-card border border-subtle-border">
            <img 
              src={paymentMethodsImage} 
              alt="Formas de pagamento aceitas: Visa, Mastercard, Elo, American Express, Hipercard, Diners Club e PIX"
              loading="lazy"
              className="mx-auto max-w-full h-auto"
            />
            
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-premium-gold rounded-full"></div>
                <span>Pagamento 100% Seguro</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-premium-gold rounded-full"></div>
                <span>Processamento Instantâneo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-premium-gold rounded-full"></div>
                <span>Dados Criptografados</span>
              </div>
            </div>
            
            <WhatsAppButton className="mx-auto" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentMethods;