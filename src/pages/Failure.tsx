import { motion } from "framer-motion";
import { XCircle, MessageCircle, ArrowLeft, RefreshCw } from "lucide-react";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { useSearchParams, useNavigate } from "react-router-dom";

const Failure = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const erro = searchParams.get('erro');
  
  const errorMessages: Record<string, string> = {
    'pagamento': 'Seu pagamento não pôde ser processado.',
    'cancelado': 'Você cancelou o pagamento.',
    'rejeitado': 'O pagamento foi rejeitado.',
    'timeout': 'O tempo limite para pagamento expirou.'
  };

  const errorMessage = erro ? errorMessages[erro] || 'Ocorreu um problema com seu pagamento.' : 'Ocorreu um problema com seu pagamento.';

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10 flex items-center justify-center px-4">
      <motion.div
        className="max-w-2xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Error Icon */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-destructive/20 rounded-full blur-xl"></div>
            <XCircle className="w-24 h-24 text-destructive relative z-10" />
          </div>
        </motion.div>

        {/* Main Card */}
        <motion.div
          className="bg-gradient-card rounded-2xl shadow-card p-8 md:p-12 border border-destructive/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
            Pagamento Não Concluído
          </h1>
          
          <p className="text-center text-muted-foreground mb-8 text-lg">
            {errorMessage}
          </p>

          {/* Information */}
          <div className="space-y-4 mb-8 bg-accent/10 rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-3">O que pode ter acontecido?</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-premium-gold">•</span>
                <span>Pagamento cancelado durante o processo</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-premium-gold">•</span>
                <span>Dados do cartão inválidos ou insuficiência de fundos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-premium-gold">•</span>
                <span>Problema de conexão durante a transação</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-premium-gold">•</span>
                <span>Tempo limite de pagamento excedido</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              onClick={() => navigate('/#planos')}
              className="w-full text-lg py-6 bg-gradient-gold hover:shadow-gold"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Tentar Novamente
            </Button>

            <WhatsAppButton 
              className="w-full text-lg py-6"
              message="Olá!%20Tive%20um%20problema%20ao%20tentar%20realizar%20o%20pagamento%20no%20Mundo%20Play%20TV.%20Podem%20me%20ajudar?"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Falar com Suporte
            </WhatsAppButton>

            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar para Início
            </Button>
          </div>
        </motion.div>

        {/* Help Text */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-muted-foreground">
            💡 Não se preocupe! Nenhum valor foi cobrado. Entre em contato conosco para resolver qualquer dúvida.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Failure;
