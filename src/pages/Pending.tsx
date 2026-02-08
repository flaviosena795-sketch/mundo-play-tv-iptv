import { motion } from "framer-motion";
import { Clock, MessageCircle, AlertCircle, CreditCard, Zap, FileText, Shield } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

const Pending = () => {
  const [searchParams] = useSearchParams();
  const planoUrl = searchParams.get('plano') || '';
  const valor = searchParams.get('valor') || '';
  const collectionId = searchParams.get('collection_id') || searchParams.get('payment_id') || '';

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [plano, setPlano] = useState('');

  const supportNumber = '5521966238378';

  useEffect(() => {
    const storedName = localStorage.getItem('mp_full_name') || '';
    const storedPhone = localStorage.getItem('mp_phone') || '';
    const storedPlan = localStorage.getItem('mp_plan') || '';

    setFullName(storedName);
    setPhone(storedPhone);
    setPlano(planoUrl || storedPlan || 'seu plano');
  }, [planoUrl]);

  const whatsappMessage = encodeURIComponent(
    `Olá! Meu pagamento está em análise.\n\n` +
    `👤 Nome: ${fullName}\n` +
    `📱 WhatsApp: ${phone}\n` +
    `📦 Plano: ${plano}${valor ? ` (R$${valor})` : ''}\n` +
    `💳 ID do Pagamento: ${collectionId}\n\n` +
    `Gostaria de saber o status.`
  );

  const waUrl = `https://wa.me/${supportNumber}?text=${whatsappMessage}`;

  const timeframes = [
    { icon: Zap, method: "PIX", time: "Confirmado em segundos" },
    { icon: CreditCard, method: "Cartão", time: "Geralmente aprovado em minutos" },
    { icon: FileText, method: "Boleto", time: "Até 3 dias úteis para compensação" },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center px-4 py-12">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"
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
        {/* Pending Icon */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 15 }}
        >
          <div className="relative">
            <motion.div
              className="absolute -inset-4 bg-yellow-500/15 rounded-full blur-2xl"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="relative w-20 h-20 bg-yellow-500/15 border-2 border-yellow-500/30 rounded-full flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Clock className="w-10 h-10 text-yellow-500" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Main Card */}
        <motion.div
          className="bg-gradient-card rounded-2xl border border-yellow-500/20 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ boxShadow: '0 0 30px hsl(45 93% 47% / 0.1)' }}
        >
          {/* Header */}
          <div className="p-6 md:p-8 text-center border-b border-border/50">
            <motion.h1
              className="text-2xl md:text-3xl font-bold text-yellow-500 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Pagamento em Análise
            </motion.h1>

            {fullName && (
              <motion.p
                className="text-foreground text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Olá, <span className="text-accent font-semibold">{fullName}</span>!
              </motion.p>
            )}
          </div>

          {/* Plan Badge */}
          <div className="px-6 md:px-8 -mt-4 flex justify-center">
            <motion.div
              className="bg-yellow-500/10 border border-yellow-500/30 rounded-full px-5 py-2 inline-flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-semibold text-yellow-500">Plano {plano}</span>
              {valor && (
                <span className="text-xs text-muted-foreground">• R$ {valor}</span>
              )}
            </motion.div>
          </div>

          {/* Timeframes */}
          <div className="p-6 md:px-8 md:pt-6 md:pb-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 text-center font-medium">
              Tempo estimado por método
            </p>
            <div className="space-y-3">
              {timeframes.map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-4 p-3 rounded-xl bg-secondary/50 border border-border/50"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <div className="w-9 h-9 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{item.method}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* WhatsApp CTA */}
          <div className="p-6 md:px-8 md:pb-8">
            <motion.a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-3 w-full py-4 px-6 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(37,211,102,0.4)]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <MessageCircle className="w-5 h-5" />
              Falar com Suporte
            </motion.a>

            {collectionId && (
              <p className="text-center text-[10px] text-muted-foreground/50 mt-3 font-mono">
                ID: {collectionId}
              </p>
            )}
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

export default Pending;
