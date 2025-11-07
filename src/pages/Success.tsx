import { motion } from "framer-motion";
import { CheckCircle, MessageCircle, Clock, Tv } from "lucide-react";
import WhatsAppButton from "@/components/WhatsAppButton";

const Success = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10 flex items-center justify-center px-4">
      <motion.div
        className="max-w-2xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Success Icon */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-premium-gold/20 rounded-full blur-xl"></div>
            <CheckCircle className="w-24 h-24 text-premium-gold relative z-10" />
          </div>
        </motion.div>

        {/* Main Card */}
        <motion.div
          className="bg-gradient-card rounded-2xl shadow-gold p-8 md:p-12 border border-premium-gold/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-premium-gold">
            🎉 Pagamento Confirmado!
          </h1>
          
          <p className="text-center text-muted-foreground mb-8 text-lg">
            Seu plano Mundo Play TV foi ativado com sucesso!
          </p>

          {/* Instructions */}
          <div className="space-y-6 mb-8">
            <div className="flex items-start gap-4 p-4 bg-accent/10 rounded-lg">
              <Clock className="w-6 h-6 text-premium-gold flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Próximos Passos</h3>
                <p className="text-sm text-muted-foreground">
                  Em até 5 minutos você receberá suas credenciais de acesso por WhatsApp.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-accent/10 rounded-lg">
              <Tv className="w-6 h-6 text-premium-gold flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Como Ativar</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>1. Baixe o aplicativo recomendado para seu dispositivo</li>
                  <li>2. Use as credenciais enviadas por WhatsApp</li>
                  <li>3. Aproveite +15.000 canais em 4K Ultra HD!</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-accent/10 rounded-lg">
              <MessageCircle className="w-6 h-6 text-premium-gold flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Suporte 24/7</h3>
                <p className="text-sm text-muted-foreground">
                  Qualquer dúvida, nossa equipe está pronta para ajudar via WhatsApp.
                </p>
              </div>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <div className="space-y-4">
            <WhatsAppButton 
              className="w-full text-lg py-6"
              message="Olá!%20Acabei%20de%20realizar%20meu%20pagamento%20no%20Mundo%20Play%20TV.%20Gostaria%20de%20receber%20minhas%20credenciais%20de%20acesso."
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Receber Credenciais no WhatsApp
            </WhatsAppButton>

            <p className="text-center text-xs text-muted-foreground">
              Não recebeu a mensagem? Clique no botão acima para solicitar suas credenciais
            </p>
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <a 
            href="/" 
            className="text-premium-gold hover:underline text-sm"
          >
            ← Voltar para página inicial
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Success;
