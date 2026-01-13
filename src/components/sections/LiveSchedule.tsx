import { Calendar, Clock, Tv } from "lucide-react";
import { motion } from "framer-motion";

const LiveSchedule = () => {
  const games = [
    {
      id: 1,
      sport: "Futebol",
      league: "Brasileirão Série A",
      homeTeam: "Flamengo",
      awayTeam: "Palmeiras",
      homeFlag: "🔴⚫",
      awayFlag: "🟢⚪",
      date: "Hoje",
      time: "21:30",
      isLive: true,
    },
    {
      id: 2,
      sport: "Futebol",
      league: "Champions League",
      homeTeam: "Real Madrid",
      awayTeam: "Manchester City",
      homeFlag: "⚪🟣",
      awayFlag: "🔵⚪",
      date: "Amanhã",
      time: "16:00",
      isLive: false,
    },
    {
      id: 3,
      sport: "UFC",
      league: "UFC 310",
      homeTeam: "Jon Jones",
      awayTeam: "Stipe Miocic",
      homeFlag: "🇺🇸",
      awayFlag: "🇺🇸",
      date: "Sábado",
      time: "23:00",
      isLive: false,
    },
    {
      id: 4,
      sport: "NBA",
      league: "NBA Regular Season",
      homeTeam: "Lakers",
      awayTeam: "Celtics",
      homeFlag: "💜💛",
      awayFlag: "🍀⚪",
      date: "Domingo",
      time: "18:00",
      isLive: false,
    },
    {
      id: 5,
      sport: "Futebol",
      league: "Premier League",
      homeTeam: "Liverpool",
      awayTeam: "Arsenal",
      homeFlag: "🔴",
      awayFlag: "🔴⚪",
      date: "Domingo",
      time: "13:30",
      isLive: false,
    },
    {
      id: 6,
      sport: "F1",
      league: "Grande Prêmio do Brasil",
      homeTeam: "Corrida Principal",
      awayTeam: "Interlagos",
      homeFlag: "🏎️",
      awayFlag: "🇧🇷",
      date: "Domingo",
      time: "14:00",
      isLive: false,
    },
  ];

  const getSportIcon = (sport: string) => {
    switch (sport) {
      case "Futebol":
        return "⚽";
      case "UFC":
        return "🥊";
      case "NBA":
        return "🏀";
      case "F1":
        return "🏎️";
      default:
        return "🏆";
    }
  };

  const getSportColor = (sport: string) => {
    switch (sport) {
      case "Futebol":
        return "from-green-500/20 to-green-600/10 border-green-500/30";
      case "UFC":
        return "from-red-500/20 to-red-600/10 border-red-500/30";
      case "NBA":
        return "from-orange-500/20 to-orange-600/10 border-orange-500/30";
      case "F1":
        return "from-red-600/20 to-black/10 border-red-600/30";
      default:
        return "from-premium-gold/20 to-premium-gold/10 border-premium-gold/30";
    }
  };

  return (
    <section
      id="programacao"
      className="py-20 bg-gradient-to-b from-background to-darker-bg"
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
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-premium-gold/10 px-4 py-2 rounded-full mb-6">
              <Calendar className="w-4 h-4 text-premium-gold" />
              <span className="text-premium-gold font-semibold text-sm uppercase tracking-wide">
                Programação
              </span>
            </div>
            <h2 id="schedule-heading" className="text-4xl md:text-5xl font-bold mb-4">
              📺 Próximos <span className="text-premium-gold">Jogos ao Vivo</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Confira a programação dos principais eventos esportivos. 
              Assista tudo em qualidade 4K, sem travamentos!
            </p>
          </motion.div>

          {/* Games Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${getSportColor(
                  game.sport
                )} border backdrop-blur-sm hover:scale-[1.02] transition-all duration-300`}
              >
                {/* Live Indicator */}
                {game.isLive && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-red-500/90 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    <span className="text-white text-xs font-bold uppercase">Ao Vivo</span>
                  </div>
                )}

                <div className="p-6">
                  {/* Sport & League */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">{getSportIcon(game.sport)}</span>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        {game.sport}
                      </p>
                      <p className="text-sm font-semibold text-foreground/90">{game.league}</p>
                    </div>
                  </div>

                  {/* Teams */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-center flex-1">
                      <p className="text-2xl mb-1">{game.homeFlag}</p>
                      <p className="font-bold text-foreground text-sm">{game.homeTeam}</p>
                    </div>
                    <div className="px-4">
                      <span className="text-2xl font-bold text-premium-gold">VS</span>
                    </div>
                    <div className="text-center flex-1">
                      <p className="text-2xl mb-1">{game.awayFlag}</p>
                      <p className="font-bold text-foreground text-sm">{game.awayTeam}</p>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{game.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-semibold">{game.time}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <a
              href="https://wa.me/5521966238378?text=Olá!%20Quero%20assistir%20esportes%20ao%20vivo!"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-premium-gold text-black font-bold px-8 py-4 rounded-full hover:bg-premium-gold-hover transition-premium shadow-lg shadow-premium-gold/25 text-lg"
            >
              <Tv className="w-5 h-5" />
              Assista Todos os Jogos Agora
            </a>
            <p className="text-sm text-muted-foreground mt-4">
              ✓ Qualidade 4K • ✓ Sem travamentos • ✓ Todos os campeonatos
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LiveSchedule;
