import { motion } from "framer-motion";
import { CheckCircle, MessageCircle, Clock, Tv, Loader2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

const Success = () => {
  const [searchParams] = useSearchParams();
  const planoUrl = searchParams.get('plano') || '';
  const valor = searchParams.get('valor') || '';
  const nomeUrl = searchParams.get('nome') || '';
  const collectionId = searchParams.get('collection_id') || searchParams.get('payment_id') || '';
  
  // Get data from URL or localStorage
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [plano, setPlano] = useState('');
  const [redirecting, setRedirecting] = useState(true);
  
  const supportNumber = '5521966238378';

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
    
    // Auto redirect to WhatsApp after 2 seconds
    const timer = setTimeout(() => {
      const message = encodeURIComponent(
        `🎉 NOVO PAGAMENTO APROVADO!\n\n` +
        `👤 Nome: ${clientName}\n` +
        `📱 WhatsApp: ${clientPhone}\n` +
        `📦 Plano: ${clientPlan}${valor ? ` (R$ ${valor})` : ''}\n` +
        `💳 ID do Pagamento: ${collectionId}\n\n` +
        `✅ Pagamento confirmado com sucesso.\n` +
        `Solicito ativação imediata do serviço.`
      );
      
      const waUrl = `https://wa.me/${supportNumber}?text=${message}`;
      
      setRedirecting(false);
      window.location.href = waUrl;
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [nomeUrl, planoUrl, valor, collectionId]);

  const whatsappMessage = encodeURIComponent(
    `🎉 NOVO PAGAMENTO APROVADO!\n\n` +
    `👤 Nome: ${fullName}\n` +
    `📱 WhatsApp: ${phone}\n` +
    `📦 Plano: ${plano}${valor ? ` (R$ ${valor})` : ''}\n` +
    `💳 ID do Pagamento: ${collectionId}\n\n` +
    `✅ Pagamento confirmado com sucesso.\n` +
    `Solicito ativação imediata do serviço.`
  );

  const waUrl = `https://wa.me/${supportNumber}?text=${whatsappMessage}`;

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
          
          {redirecting && (
            <div className="flex items-center justify-center gap-2 mb-4 text-premium-gold">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Redirecionando para WhatsApp...</span>
            </div>
          )}
          
          {fullName && (
            <p className="text-center text-foreground mb-2 text-lg">
              Obrigado, <span className="text-premium-gold font-semibold">{fullName}</span>!
            </p>
          )}
          
          <p className="text-center text-muted-foreground mb-2 text-lg">
            Seu <span className="text-premium-gold font-semibold">Plano {plano}</span> foi ativado com sucesso!
          </p>
          {valor && (
            <p className="text-center text-sm text-muted-foreground mb-2">
              Valor: R$ {valor}
            </p>
          )}
          {collectionId && (
            <p className="text-center text-xs text-muted-foreground mb-8">
              ID do Pagamento: {collectionId}
            </p>
          )}

          {/* Instructions */}
          <div className="space-y-6 mb-8">
            <div className="flex items-start gap-4 p-4 bg-accent/10 rounded-lg">
              <Clock className="w-6 h-6 text-premium-gold flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Próximos Passos</h3>
                <p className="text-sm text-muted-foreground">
                  Clique no botão abaixo para receber suas credenciais de acesso por WhatsApp.
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
            <a 
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full text-lg py-4 px-6 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold rounded-lg transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Receber Credenciais no WhatsApp
            </a>

            <p className="text-center text-xs text-muted-foreground">
              Clique no botão acima para solicitar suas credenciais de acesso
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
