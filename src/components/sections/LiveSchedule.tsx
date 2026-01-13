import { Calendar, Clock, Tv, Loader2, RefreshCw, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";

interface GameData {
  id: number;
  sport: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  date: string;
  time: string;
  isLive: boolean;
  status: string;
  homeScore: number | null;
  awayScore: number | null;
}

// Fallback games when API is unavailable
const fallbackGames: GameData[] = [
  {
    id: 1,
    sport: "Futebol",
    league: "Brasileirão Série A",
    homeTeam: "Flamengo",
    awayTeam: "Palmeiras",
    homeLogo: "",
    awayLogo: "",
    date: "Hoje",
    time: "21:30",
    isLive: true,
    status: "Em andamento",
    homeScore: 1,
    awayScore: 0,
  },
  {
    id: 2,
    sport: "Futebol",
    league: "Champions League",
    homeTeam: "Real Madrid",
    awayTeam: "Man City",
    homeLogo: "",
    awayLogo: "",
    date: "Amanhã",
    time: "16:00",
    isLive: false,
    status: "Agendado",
    homeScore: null,
    awayScore: null,
  },
  {
    id: 3,
    sport: "Futebol",
    league: "Premier League",
    homeTeam: "Liverpool",
    awayTeam: "Arsenal",
    homeLogo: "",
    awayLogo: "",
    date: "Domingo",
    time: "13:30",
    isLive: false,
    status: "Agendado",
    homeScore: null,
    awayScore: null,
  },
  {
    id: 4,
    sport: "Futebol",
    league: "La Liga",
    homeTeam: "Barcelona",
    awayTeam: "Atlético",
    homeLogo: "",
    awayLogo: "",
    date: "Sábado",
    time: "17:00",
    isLive: false,
    status: "Agendado",
    homeScore: null,
    awayScore: null,
  },
  {
    id: 5,
    sport: "Futebol",
    league: "Libertadores",
    homeTeam: "Boca Juniors",
    awayTeam: "River Plate",
    homeLogo: "",
    awayLogo: "",
    date: "Quinta",
    time: "21:00",
    isLive: false,
    status: "Agendado",
    homeScore: null,
    awayScore: null,
  },
  {
    id: 6,
    sport: "Futebol",
    league: "Brasileirão Série A",
    homeTeam: "Corinthians",
    awayTeam: "São Paulo",
    homeLogo: "",
    awayLogo: "",
    date: "Domingo",
    time: "18:30",
    isLive: false,
    status: "Agendado",
    homeScore: null,
    awayScore: null,
  },
];

const leagueFilters = [
  { id: "all", label: "Todos", icon: "🏆" },
  { id: "brasileirao", label: "Brasileirão", icon: "🇧🇷", keywords: ["Brasileirão", "Serie A", "Série A"] },
  { id: "champions", label: "Champions", icon: "⭐", keywords: ["Champions", "UEFA Champions"] },
  { id: "premier", label: "Premier", icon: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", keywords: ["Premier League", "Premier"] },
  { id: "laliga", label: "La Liga", icon: "🇪🇸", keywords: ["La Liga", "LaLiga"] },
  { id: "libertadores", label: "Libertadores", icon: "🏆", keywords: ["Libertadores", "Copa Libertadores"] },
];

const LiveSchedule = () => {
  const [games, setGames] = useState<GameData[]>(fallbackGames);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchGames = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fnError } = await supabase.functions.invoke('get-live-games');
      
      if (fnError) {
        console.error('Error fetching games:', fnError);
        setError('Usando dados de exemplo');
        setGames(fallbackGames);
      } else if (data?.games && data.games.length > 0) {
        setGames(data.games);
        setLastUpdated(new Date());
      } else {
        setGames(fallbackGames);
        setError('Nenhum jogo encontrado');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Usando dados de exemplo');
      setGames(fallbackGames);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchGames, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter games based on active filter
  const filteredGames = useMemo(() => {
    if (activeFilter === "all") return games;
    
    const filter = leagueFilters.find(f => f.id === activeFilter);
    if (!filter || !filter.keywords) return games;
    
    return games.filter(game => 
      filter.keywords!.some(keyword => 
        game.league.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  }, [games, activeFilter]);

  const getLeagueColor = (league: string) => {
    if (league.includes('Brasileirão') || league.includes('Serie A')) {
      return "from-green-500/20 to-yellow-600/10 border-green-500/30";
    }
    if (league.includes('Champions')) {
      return "from-blue-500/20 to-blue-600/10 border-blue-500/30";
    }
    if (league.includes('Premier')) {
      return "from-purple-500/20 to-purple-600/10 border-purple-500/30";
    }
    if (league.includes('La Liga') || league.includes('LaLiga')) {
      return "from-orange-500/20 to-red-600/10 border-orange-500/30";
    }
    if (league.includes('Libertadores')) {
      return "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30";
    }
    return "from-premium-gold/20 to-premium-gold/10 border-premium-gold/30";
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
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-premium-gold/10 px-4 py-2 rounded-full mb-6">
              <Calendar className="w-4 h-4 text-premium-gold" />
              <span className="text-premium-gold font-semibold text-sm uppercase tracking-wide">
                Programação ao Vivo
              </span>
            </div>
            <h2 id="schedule-heading" className="text-4xl md:text-5xl font-bold mb-4">
              📺 Próximos <span className="text-premium-gold">Jogos ao Vivo</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Confira a programação dos principais eventos esportivos. 
              Assista tudo em qualidade 4K, sem travamentos!
            </p>
            
            {/* Last Updated & Refresh */}
            <div className="flex items-center justify-center gap-4 mt-4">
              {lastUpdated && (
                <span className="text-xs text-muted-foreground">
                  Atualizado: {lastUpdated.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
              <button
                onClick={fetchGames}
                disabled={loading}
                className="inline-flex items-center gap-1 text-xs text-premium-gold hover:text-premium-gold-hover transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </button>
            </div>
          </motion.div>

          {/* League Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-muted-foreground mr-2" />
              {leagueFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeFilter === filter.id
                      ? "bg-premium-gold text-black shadow-lg shadow-premium-gold/25"
                      : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <span>{filter.icon}</span>
                  <span className="hidden sm:inline">{filter.label}</span>
                </button>
              ))}
            </div>
            
            {/* Active filter count */}
            {activeFilter !== "all" && (
              <p className="text-center text-sm text-muted-foreground mt-3">
                {filteredGames.length} jogo{filteredGames.length !== 1 ? 's' : ''} encontrado{filteredGames.length !== 1 ? 's' : ''}
              </p>
            )}
          </motion.div>

          {/* Loading State */}
          {loading && games === fallbackGames && (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-premium-gold animate-spin" />
            </div>
          )}

          {/* No games message */}
          {!loading && filteredGames.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-xl text-muted-foreground mb-2">😔 Nenhum jogo encontrado</p>
              <p className="text-sm text-muted-foreground">
                Não há jogos agendados para esta liga no momento.
              </p>
              <button
                onClick={() => setActiveFilter("all")}
                className="mt-4 text-premium-gold hover:text-premium-gold-hover transition-colors text-sm"
              >
                Ver todos os jogos →
              </button>
            </motion.div>
          )}

          {/* Games Grid */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeFilter}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredGames.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${getLeagueColor(
                  game.league
                )} border backdrop-blur-sm hover:scale-[1.02] transition-all duration-300`}
              >
                {/* Live Indicator */}
                {game.isLive && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-red-500/90 px-3 py-1 rounded-full z-10">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    <span className="text-white text-xs font-bold uppercase">Ao Vivo</span>
                  </div>
                )}

                <div className="p-6">
                  {/* League */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">⚽</span>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        {game.sport}
                      </p>
                      <p className="text-sm font-semibold text-foreground/90 truncate max-w-[200px]">
                        {game.league}
                      </p>
                    </div>
                  </div>

                  {/* Teams */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-center flex-1">
                      {game.homeLogo ? (
                        <img 
                          src={game.homeLogo} 
                          alt={game.homeTeam}
                          className="w-12 h-12 mx-auto mb-1 object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <p className="text-3xl mb-1">🏠</p>
                      )}
                      <p className="font-bold text-foreground text-xs truncate max-w-[80px] mx-auto">
                        {game.homeTeam}
                      </p>
                      {game.isLive && game.homeScore !== null && (
                        <p className="text-xl font-bold text-premium-gold mt-1">{game.homeScore}</p>
                      )}
                    </div>
                    
                    <div className="px-3">
                      {game.isLive && game.homeScore !== null ? (
                        <span className="text-lg font-bold text-muted-foreground">-</span>
                      ) : (
                        <span className="text-xl font-bold text-premium-gold">VS</span>
                      )}
                    </div>
                    
                    <div className="text-center flex-1">
                      {game.awayLogo ? (
                        <img 
                          src={game.awayLogo} 
                          alt={game.awayTeam}
                          className="w-12 h-12 mx-auto mb-1 object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <p className="text-3xl mb-1">✈️</p>
                      )}
                      <p className="font-bold text-foreground text-xs truncate max-w-[80px] mx-auto">
                        {game.awayTeam}
                      </p>
                      {game.isLive && game.awayScore !== null && (
                        <p className="text-xl font-bold text-premium-gold mt-1">{game.awayScore}</p>
                      )}
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
          </motion.div>
          </AnimatePresence>

          {/* Error message */}
          {error && (
            <p className="text-center text-sm text-muted-foreground mt-4">
              ⚠️ {error}
            </p>
          )}

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
