import { Clock, Gift, Sparkles } from "lucide-react";
import WhatsAppButton from "@/components/WhatsAppButton";
import { motion } from "framer-motion";

const FreeTrialBanner = () => {
  return (
    <section id="teste-gratis" className="py-16 bg-gradient-to-r from-premium-gold/10 via-premium-gold/5 to-transparent border-y border-premium-gold/20 relative overflow-hidden" aria-labelledby="free-trial-heading">
      {/* Animated background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-premium-gold/10 rounded-full blur-[100px]"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="flex justify-center items-center gap-4 mb-6"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Gift className="w-12 h-12 text-premium-gold" />
            </motion.div>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Sparkles className="w-8 h-8 text-premium-gold" />
            </motion.div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Clock className="w-12 h-12 text-premium-gold" />
            </motion.div>
          </motion.div>
          
          <div className="mb-8">
            <motion.h2 
              id="free-trial-heading" 
              className="text-5xl md:text-6xl font-bold mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <motion.span 
                className="text-premium-gold inline-block relative"
                animate={{ 
                  textShadow: [
                    "0 0 20px rgba(249, 115, 22, 0.5)",
                    "0 0 40px rgba(249, 115, 22, 0.8)",
                    "0 0 20px rgba(249, 115, 22, 0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                12 horas
                <motion.span 
                  className="absolute -top-2 -right-6"
                  animate={{ 
                    scale: [0.8, 1.2, 0.8],
                    rotate: [0, 15, -15, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-6 h-6 text-premium-gold" />
                </motion.span>
              </motion.span>
              {" "}exclusivas
            </motion.h2>
            <motion.h3 
              className="text-3xl md:text-4xl font-bold text-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              para o seu <span className="text-premium-gold">Teste GRÁTIS</span>
            </motion.h3>
          </div>
          
          <motion.p 
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            Experimente nossa plataforma premium sem compromisso. 
            Acesso completo a todos os canais em qualidade 4K por 12 horas inteiras!
          </motion.p>
          
          {/* Vídeo demonstrativo */}
          <motion.div 
            className="mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-3xl font-bold text-premium-gold mb-2">+10.000</div>
                <div className="text-sm text-muted-foreground">Canais Disponíveis</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-3xl font-bold text-premium-gold mb-2">4K</div>
                <div className="text-sm text-muted-foreground">Ultra HD Quality</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
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
            transition={{ delay: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <WhatsAppButton className="text-xl px-12 py-6 h-auto font-bold" />
            </motion.div>
            <p className="text-sm text-muted-foreground">
              ⚡ Ativação imediata • 🔒 Sem compromisso • 💯 Satisfação garantida
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FreeTrialBanner;
