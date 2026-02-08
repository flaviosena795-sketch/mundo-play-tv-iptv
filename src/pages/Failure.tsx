import { motion } from "framer-motion";
import { XCircle, MessageCircle, RefreshCw, AlertTriangle, CreditCard, Wifi, Clock, Shield } from "lucide-react";
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

  const reasons = [
    { icon: CreditCard, text: "Dados do cartão inválidos ou saldo insuficiente" },
    { icon: Wifi, text: "Problema de conexão durante a transação" },
    { icon: Clock, text: "Tempo limite de pagamento excedido" },
    { icon: XCircle, text: "Pagamento cancelado durante o processo" },
  ];

  const supportNumber = '5521966238378';
  const waUrl = `https://wa.me/${supportNumber}?text=${encodeURIComponent('Olá! Tive um problema ao tentar realizar o pagamento no Mundo Play TV. Podem me ajudar?')}`;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center px-4 py-12">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/3 left-1/3 w-96 h-96 bg-destructive/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        className="max-w-xl w-full relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Error Icon */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 15 }}
        >
          <div className="relative">
            <motion.div
              className="absolute -inset-4 bg-destructive/15 rounded-full blur-2xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="relative w-20 h-20 bg-destructive/20 border-2 border-destructive/40 rounded-full flex items-center justify-center">
              <XCircle className="w-10 h-10 text-destructive" />
            </div>
          </div>
        </motion.div>

        {/* Main Card */}
        <motion.div
          className="bg-gradient-card rounded-2xl border border-destructive/20 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ boxShadow: '0 0 30px hsl(0 62.8% 30.6% / 0.15)' }}
        >
          {/* Header */}
          <div className="p-6 md:p-8 text-center border-b border-border/50">
            <motion.h1
              className="text-2xl md:text-3xl font-bold text-foreground mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Pagamento Não Concluído
            </motion.h1>
            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {errorMessage}
            </motion.p>
          </div>

          {/* Info Badge */}
          <div className="px-6 md:px-8 -mt-4 flex justify-center">
            <motion.div
              className="bg-accent/10 border border-accent/30 rounded-full px-5 py-2 inline-flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <AlertTriangle className="w-4 h-4 text-accent" />
              <span className="text-xs font-medium text-accent">Nenhum valor foi cobrado</span>
            </motion.div>
          </div>

          {/* Reasons */}
          <div className="p-6 md:px-8 md:pt-6 md:pb-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 text-center font-medium">
              Possíveis motivos
            </p>
            <div className="space-y-3">
              {reasons.map((reason, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-4 p-3 rounded-xl bg-secondary/50 border border-border/50"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                >
                  <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
                    <reason.icon className="w-4 h-4 text-destructive/70" />
                  </div>
                  <p className="text-sm text-muted-foreground">{reason.text}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 md:px-8 md:pb-8 space-y-3">
            <motion.button
              onClick={() => navigate('/#planos')}
              className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-gradient-gold text-accent-foreground font-bold rounded-xl transition-all duration-300 hover:shadow-gold"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw className="w-5 h-5" />
              Tentar Novamente
            </motion.button>

            <motion.a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(37,211,102,0.4)]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <MessageCircle className="w-5 h-5" />
              Falar com Suporte
            </motion.a>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="flex items-center justify-between mt-6 px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <a href="/" className="text-muted-foreground hover:text-accent text-xs transition-colors">
            ← Página inicial
          </a>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
            <Shield className="w-3 h-3" />
            <span>Suporte 24/7</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Failure;
