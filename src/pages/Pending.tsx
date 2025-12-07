import { motion } from "framer-motion";
import { Clock, MessageCircle, AlertCircle, RefreshCw } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10 flex items-center justify-center px-4">
      <motion.div
        className="max-w-2xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Pending Icon */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl"></div>
            <Clock className="w-24 h-24 text-yellow-500 relative z-10" />
          </div>
        </motion.div>

        {/* Main Card */}
        <motion.div
          className="bg-gradient-card rounded-2xl shadow-gold p-8 md:p-12 border border-yellow-500/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-yellow-500">
            ⏳ Pagamento em Análise
          </h1>
          
          {fullName && (
            <p className="text-center text-foreground mb-2 text-lg">
              Olá, <span className="text-premium-gold font-semibold">{fullName}</span>!
            </p>
          )}
          
          <p className="text-center text-muted-foreground mb-2 text-lg">
            Seu pagamento do <span className="text-premium-gold font-semibold">Plano {plano}</span> está sendo processado.
          </p>
          
          {collectionId && (
            <p className="text-center text-xs text-muted-foreground mb-8">
              ID do Pagamento: {collectionId}
            </p>
          )}

          {/* Instructions */}
          <div className="space-y-6 mb-8">
            <div className="flex items-start gap-4 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">O que está acontecendo?</h3>
                <p className="text-sm text-muted-foreground">
                  Seu pagamento está em análise pelo Mercado Pago. Isso pode levar alguns minutos ou até 1-2 dias úteis dependendo do método de pagamento.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-accent/10 rounded-lg">
              <RefreshCw className="w-6 h-6 text-premium-gold flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Próximos Passos</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• <strong>Boleto:</strong> Aguarde até 3 dias úteis para compensação</li>
                  <li>• <strong>PIX:</strong> O pagamento é confirmado em segundos</li>
                  <li>• <strong>Cartão:</strong> Geralmente é aprovado em minutos</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-accent/10 rounded-lg">
              <MessageCircle className="w-6 h-6 text-premium-gold flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Precisa de Ajuda?</h3>
                <p className="text-sm text-muted-foreground">
                  Se tiver dúvidas sobre seu pagamento, entre em contato conosco via WhatsApp.
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
              Falar com Suporte
            </a>

            <p className="text-center text-xs text-muted-foreground">
              Você receberá um e-mail quando o pagamento for confirmado
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

export default Pending;