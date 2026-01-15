import { motion } from "framer-motion";
import { Calendar, MessageCircle } from "lucide-react";

const LiveSchedule = () => {
  return (
    <section
      id="programacao"
      className="py-16 md:py-24 bg-gradient-to-b from-background via-darker-bg to-background"
      aria-labelledby="schedule-heading"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 px-4 py-2 rounded-full mb-6">
              <Calendar className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-semibold text-sm uppercase tracking-wide">
                Jogos de Hoje
              </span>
            </div>
            
            <h2 id="schedule-heading" className="text-3xl md:text-5xl font-bold mb-4">
              ⚽ Jogos <span className="text-premium-gold">Ao Vivo Hoje</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Confira os principais jogos de futebol e assista em qualidade 4K com a <span className="text-premium-gold font-semibold">Mundo Play TV</span>
            </p>
          </motion.div>

          {/* Iframe Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl overflow-hidden border border-border/50 bg-card/30 backdrop-blur-sm shadow-2xl shadow-premium-gold/5"
          >
            <iframe 
              src="https://footystats.org/pt/fixtures" 
              width="100%" 
              height="700"
              className="border-0"
              title="Jogos de Futebol - FootyStats"
              loading="lazy"
              style={{ colorScheme: 'dark' }}
            />
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 text-center"
          >
            <a
              href="https://wa.me/5521966238378?text=Olá!%20Quero%20assinar%20a%20Mundo%20Play%20TV%20para%20assistir%20aos%20jogos%20ao%20vivo!"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/30"
            >
              <MessageCircle className="w-6 h-6" />
              Assinar Mundo Play TV
            </a>
            <p className="text-sm text-muted-foreground mt-4">
              📺 Assista todos os jogos em qualidade 4K • Sem travamentos
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LiveSchedule;
