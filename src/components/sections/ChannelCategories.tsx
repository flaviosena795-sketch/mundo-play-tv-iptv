import { motion } from "framer-motion";
import { Tv, Film, Clapperboard, Baby, Trophy, Music, Newspaper, Gamepad2 } from "lucide-react";

const categories = [
  {
    icon: Trophy,
    title: "Esportes",
    description: "Futebol, UFC, NBA, F1 e mais",
    channels: "+200 canais",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    icon: Film,
    title: "Filmes",
    description: "Lançamentos e clássicos",
    channels: "+150 canais",
    gradient: "from-purple-500 to-violet-600",
  },
  {
    icon: Clapperboard,
    title: "Séries",
    description: "Dramas, comédia e ação",
    channels: "+100 canais",
    gradient: "from-red-500 to-rose-600",
  },
  {
    icon: Baby,
    title: "Infantil",
    description: "Desenhos e educativos",
    channels: "+80 canais",
    gradient: "from-pink-400 to-fuchsia-500",
  },
  {
    icon: Tv,
    title: "TV Aberta",
    description: "Globo, SBT, Record e mais",
    channels: "+50 canais",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    icon: Newspaper,
    title: "Notícias",
    description: "Jornalismo 24 horas",
    channels: "+30 canais",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: Music,
    title: "Música",
    description: "Shows e videoclipes",
    channels: "+40 canais",
    gradient: "from-teal-500 to-cyan-600",
  },
  {
    icon: Gamepad2,
    title: "Documentários",
    description: "Natureza, história e ciência",
    channels: "+60 canais",
    gradient: "from-indigo-500 to-blue-600",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const ChannelCategories = () => {
  return (
    <section className="py-20 bg-background" aria-labelledby="channels-heading">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 id="channels-heading" className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Mais de <span className="text-premium-gold">700 Canais</span> ao Vivo
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore nossa vasta biblioteca de conteúdo organizada por categoria para você encontrar exatamente o que procura
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {categories.map((category, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative overflow-hidden rounded-2xl bg-card border border-subtle-border p-6 cursor-pointer transition-all duration-300 hover:border-premium-gold/50 hover:shadow-lg hover:shadow-premium-gold/10"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${category.gradient} mb-4`}>
                <category.icon className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-premium-gold transition-colors">
                {category.title}
              </h3>
              
              <p className="text-sm text-muted-foreground mb-3">
                {category.description}
              </p>
              
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-premium-gold rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-premium-gold">
                  {category.channels}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground">
            <span className="text-premium-gold font-semibold">+ VOD</span> com milhares de filmes e séries sob demanda
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ChannelCategories;
