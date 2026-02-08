import { motion } from "framer-motion";
import { CheckCircle, MessageCircle, Clock, Tv, Loader2, Sparkles, Shield, Zap } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

const Success = () => {
  const [searchParams] = useSearchParams();
  const planoUrl = searchParams.get('plano') || '';
  const valor = searchParams.get('valor') || '';
  const nomeUrl = searchParams.get('nome') || '';
  const collectionId = searchParams.get('collection_id') || searchParams.get('payment_id') || '';
  
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [plano, setPlano] = useState('');
  const [redirecting, setRedirecting] = useState(true);
  
  const supportNumber = '5521966238378';

  const formatValue = (val: string) => {
    if (!val) return '';
    return val.replace('.', ',');
  };

  useEffect(() => {
    const storedName = localStorage.getItem('mp_full_name') || '';
    const storedPhone = localStorage.getItem('mp_phone') || '';
    const storedPlan = localStorage.getItem('mp_plan') || '';
    
    const clientName = nomeUrl || storedName;
    const clientPhone = storedPhone;
    const clientPlan = planoUrl || storedPlan || 'seu plano';
    
    setFullName(clientName);
    setPhone(clientPhone);
    setPlano(clientPlan);
    
    const timer = setTimeout(() => {
      const formattedValue = formatValue(valor);
      const message = `🎉 NOVO PAGAMENTO APROVADO!

👤 Nome: ${clientName} 📱 WhatsApp: ${clientPhone} 📦 Plano: ${clientPlan}${formattedValue ? ` (R$ ${formattedValue})` : ''} 💳 ID do Pagamento: ${collectionId}

✅ Pagamento confirmado com sucesso. Solicito ativação imediata do serviço.`;
      
      const waUrl = `https://wa.me/${supportNumber}?text=${encodeURIComponent(message)}`;
      
      setRedirecting(false);
      window.location.href = waUrl;
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [nomeUrl, planoUrl, valor, collectionId]);

  const formattedValue = formatValue(valor);
  const whatsappMessage = `🎉 NOVO PAGAMENTO APROVADO!

👤 Nome: ${fullName} 📱 WhatsApp: ${phone} 📦 Plano: ${plano}${formattedValue ? ` (R$ ${formattedValue})` : ''} 💳 ID do Pagamento: ${collectionId}

✅ Pagamento confirmado com sucesso. Solicito ativação imediata do serviço.`;

  const waUrl = `https://wa.me/${supportNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const steps = [
    { icon: MessageCircle, title: "Solicite suas credenciais", desc: "Clique no botão abaixo para receber via WhatsApp" },
    { icon: Zap, title: "Instale o aplicativo", desc: "Baixe o app recomendado para seu dispositivo" },
    { icon: Tv, title: "Aproveite!", desc: "+15.000 canais em 4K Ultra HD à sua disposição" },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center px-4 py-12">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        className="max-w-xl w-full relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Success Animation */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 15 }}
        >
          <div className="relative">
            <motion.div
              className="absolute -inset-4 bg-accent/20 rounded-full blur-2xl"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="relative w-20 h-20 bg-gradient-gold rounded-full flex items-center justify-center shadow-gold">
              <CheckCircle className="w-10 h-10 text-accent-foreground" />
            </div>
            <motion.div
              className="absolute -top-2 -right-2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
            >
              <Sparkles className="w-6 h-6 text-accent" />
            </motion.div>
          </div>
        </motion.div>

        {/* Main Card */}
        <motion.div
          className="bg-gradient-card rounded-2xl border border-accent/20 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{ boxShadow: 'var(--shadow-gold)' }}
        >
          {/* Header */}
          <div className="p-6 md:p-8 text-center border-b border-border/50">
            <motion.h1
              className="text-2xl md:text-3xl font-bold text-accent mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Pagamento Confirmado!
            </motion.h1>

            {redirecting && (
              <motion.div
                className="flex items-center justify-center gap-2 text-accent/80 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Redirecionando para WhatsApp...</span>
              </motion.div>
            )}

            {fullName && (
              <motion.p
                className="text-foreground mt-3 text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Obrigado, <span className="text-accent font-semibold">{fullName}</span>!
              </motion.p>
            )}
          </div>

          {/* Plan Info Badge */}
          <div className="px-6 md:px-8 -mt-4 flex justify-center">
            <motion.div
              className="bg-accent/10 border border-accent/30 rounded-full px-5 py-2 inline-flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-accent">Plano {plano}</span>
              {formattedValue && (
                <span className="text-xs text-muted-foreground">• R$ {formattedValue}</span>
              )}
            </motion.div>
          </div>

          {/* Steps */}
          <div className="p-6 md:px-8 md:pt-6 md:pb-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 text-center font-medium">
              Próximos passos
            </p>
            <div className="space-y-3">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-4 p-3 rounded-xl bg-secondary/50 border border-border/50"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <step.icon className="w-4 h-4 text-accent" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.desc}</p>
                  </div>
                  <span className="ml-auto text-xs font-bold text-accent/40 flex-shrink-0">{i + 1}</span>
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
              className="group flex items-center justify-center gap-3 w-full py-4 px-6 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(37,211,102,0.4)] relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <MessageCircle className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Receber Credenciais no WhatsApp</span>
            </motion.a>

            {collectionId && (
              <p className="text-center text-[10px] text-muted-foreground/50 mt-3 font-mono">
                ID: {collectionId}
              </p>
            )}
          </div>
        </motion.div>

        {/* Support + Home link */}
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

export default Success;
