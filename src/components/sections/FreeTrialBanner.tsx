import { Clock, Gift, Sparkles } from "lucide-react";
import WhatsAppButton from "@/components/WhatsAppButton";
import { motion } from "framer-motion";

const FreeTrialBanner = () => {
  return (
    <section id="teste-gratis" className="py-16 bg-gradient-to-r from-premium-gold/10 via-premium-gold/5 to-transparent border-y border-premium-gold/20 overflow-hidden" aria-labelledby="free-trial-heading">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            className="flex justify-center items-center gap-4 mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Gift className="w-12 h-12 text-premium-gold animate-pulse" />
            <Sparkles className="w-8 h-8 text-premium-gold animate-bounce" />
            <Clock className="w-12 h-12 text-premium-gold" />
          </motion.div>
          
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 id="free-trial-heading" className="text-5xl md:text-6xl font-bold mb-4">
              <motion.span 
                className="relative inline-block text-premium-gold"
                animate={{ 
                  textShadow: [
                    "0 0 20px rgba(212, 175, 55, 0.5)",
                    "0 0 40px rgba(212, 175, 55, 0.8)",
                    "0 0 20px rgba(212, 175, 55, 0.5)"
                  ]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                <span className="relative z-10">12 horas</span>
                <motion.span 
                  className="absolute inset-0 bg-gradient-to-r from-premium-gold/20 via-premium-gold/40 to-premium-gold/20 blur-xl rounded-full"
                  animate={{ 
                    opacity: [0.5, 1, 0.5],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />
              </motion.span>
              {" "}exclusivas
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-foreground">
              para o seu{" "}
              <motion.span 
                className="text-premium-gold inline-block"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                Teste GRÁTIS
              </motion.span>
            </h3>
          </motion.div>
          
          <motion.p 
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Experimente nossa plataforma premium sem compromisso. 
            Acesso completo a todos os canais em qualidade 4K por <strong className="text-premium-gold">12 horas inteiras</strong>!
          </motion.p>
          
          {/* Vídeo demonstrativo */}
          <motion.div 
            className="mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="aspect-video bg-darker-bg rounded-xl overflow-hidden border border-premium-gold/20">
              <video
                src="/assets/free-trial-video.mp4"
                title="Demonstração do Teste Grátis"
                className="w-full h-full object-cover"
                controls
                preload="metadata"
              >
                Seu navegador não suporta vídeos HTML5.
              </video>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-card rounded-2xl p-8 border border-premium-gold/30 mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-3xl font-bold text-premium-gold mb-2">+10.000</div>
                <div className="text-sm text-muted-foreground">Canais Disponíveis</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-3xl font-bold text-premium-gold mb-2">4K</div>
                <div className="text-sm text-muted-foreground">Ultra HD Quality</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-3xl font-bold text-premium-gold mb-2">0</div>
                <div className="text-sm text-muted-foreground">Custo no Teste</div>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <WhatsAppButton className="text-xl px-12 py-6 h-auto font-bold" />
            <p className="text-sm text-muted-foreground">
              ⚡ Ativação imediata • 🔒 Sem compromisso • 💯 Satisfação garantida
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FreeTrialBanner;