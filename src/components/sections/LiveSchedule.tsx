import { motion } from "framer-motion";
import { Calendar, MessageCircle, Loader2, RefreshCw, Trophy, Zap, Filter } from "lucide-react";
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

// League filter configuration with display names and colors
const LEAGUE_FILTERS = [
  { id: "all", name: "Todas as Ligas", color: "bg-premium-gold/20 text-premium-gold border-premium-gold/40" },
  { id: "brasileirao", name: "Brasileirão", color: "bg-green-500/20 text-green-400 border-green-500/40", keywords: ["brasileirão", "série a", "brazil"] },
  { id: "champions", name: "Champions League", color: "bg-blue-500/20 text-blue-400 border-blue-500/40", keywords: ["champions"] },
  { id: "libertadores", name: "Libertadores", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40", keywords: ["libertadores"] },
  { id: "premier", name: "Premier League", color: "bg-purple-500/20 text-purple-400 border-purple-500/40", keywords: ["premier"] },
  { id: "laliga", name: "La Liga", color: "bg-orange-500/20 text-orange-400 border-orange-500/40", keywords: ["la liga"] },
  { id: "seriea", name: "Serie A (Itália)", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40", keywords: ["serie a", "italy"] },
  { id: "bundesliga", name: "Bundesliga", color: "bg-red-500/20 text-red-400 border-red-500/40", keywords: ["bundesliga"] },
  { id: "ligue1", name: "Ligue 1", color: "bg-sky-500/20 text-sky-400 border-sky-500/40", keywords: ["ligue 1"] },
];

const LiveSchedule = () => {
  const [games, setGames] = useState<GameData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const fetchGames = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("get-live-games");

      if (fnError) {
        console.error("Error fetching games:", fnError);
        setGames([]);
        setError("Não foi possível carregar os jogos.");
        return;
      }

      const rawGames: GameData[] = Array.isArray(data?.games) ? data.games : [];

      // Deduplicação
      const seen = new Set<number>();
      const cleaned = rawGames.filter((g) => {
        if (seen.has(g.id)) return false;
        seen.add(g.id);
        return true;
      });

      setGames(cleaned);
      setLastUpdated(new Date());

      if (cleaned.length === 0) {
        setError("Sem jogos das principais ligas no momento.");
      }
    } catch (err) {
      console.error("Error:", err);
      setGames([]);
      setError("Não foi possível carregar os jogos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
    const interval = setInterval(fetchGames, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter games based on selected league
  const filteredGames = useMemo(() => {
    if (selectedFilter === "all") return games;
    
    const filter = LEAGUE_FILTERS.find(f => f.id === selectedFilter);
    if (!filter || !filter.keywords) return games;
    
    return games.filter(game => {
      const leagueLower = game.league.toLowerCase();
      return filter.keywords!.some(keyword => leagueLower.includes(keyword));
    });
  }, [games, selectedFilter]);

  // Get available leagues from current games
  const availableFilters = useMemo(() => {
    const available = new Set<string>(["all"]);
    
    games.forEach(game => {
      const leagueLower = game.league.toLowerCase();
      LEAGUE_FILTERS.forEach(filter => {
        if (filter.keywords?.some(keyword => leagueLower.includes(keyword))) {
          available.add(filter.id);
        }
      });
    });
    
    return LEAGUE_FILTERS.filter(f => available.has(f.id));
  }, [games]);

  const getLeagueGradient = (league: string) => {
    const l = league.toLowerCase();
    if (l.includes('brasileirão') || l.includes('série a') || l.includes('serie a brazil')) {
      return "from-green-600/30 to-yellow-500/20";
    }
    if (l.includes('champions')) return "from-blue-600/30 to-purple-500/20";
    if (l.includes('premier')) return "from-purple-600/30 to-pink-500/20";
    if (l.includes('la liga')) return "from-orange-500/30 to-red-500/20";
    if (l.includes('bundesliga')) return "from-red-500/30 to-yellow-500/20";
    if (l.includes('serie a')) return "from-emerald-500/30 to-green-500/20";
    if (l.includes('ligue 1')) return "from-blue-500/30 to-red-500/20";
    if (l.includes('libertadores')) return "from-yellow-500/30 to-amber-500/20";
    return "from-premium-gold/30 to-premium-gold/10";
  };

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

            {/* Refresh */}
            <div className="flex items-center justify-center gap-4 mt-4">
              {lastUpdated && (
                <span className="text-xs text-muted-foreground">
                  Atualizado: {lastUpdated.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
              <button
                onClick={fetchGames}
                disabled={loading}
                className="inline-flex items-center gap-1.5 text-xs text-green-400 hover:text-green-300 transition-colors disabled:opacity-50 bg-green-500/10 px-3 py-1.5 rounded-full"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </button>
            </div>
          </motion.div>

          {/* League Filters */}
          {games.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Filtrar por liga:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableFilters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${
                      selectedFilter === filter.id
                        ? filter.color + " scale-105 shadow-lg"
                        : "bg-muted/20 text-muted-foreground border-muted/30 hover:bg-muted/40"
                    }`}
                  >
                    {filter.name}
                    {filter.id !== "all" && (
                      <span className="ml-2 text-xs opacity-70">
                        ({games.filter(g => {
                          const leagueLower = g.league.toLowerCase();
                          return filter.keywords?.some(k => leagueLower.includes(k));
                        }).length})
                      </span>
                    )}
                    {filter.id === "all" && (
                      <span className="ml-2 text-xs opacity-70">({games.length})</span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Loading */}
          {loading && games.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-10 h-10 text-premium-gold animate-spin mb-4" />
              <p className="text-muted-foreground">Carregando jogos...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && games.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-muted/10 rounded-2xl border border-muted/20"
            >
              <p className="text-2xl mb-2">📺</p>
              <p className="text-lg text-muted-foreground mb-2">Sem jogos no momento</p>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <a
                href="https://wa.me/5521966238378?text=Olá!%20Quero%20saber%20mais%20sobre%20a%20Mundo%20Play%20TV!"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-green-500 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Falar no WhatsApp
              </a>
            </motion.div>
          )}

          {/* Filtered Empty State */}
          {!loading && games.length > 0 && filteredGames.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-muted/10 rounded-2xl border border-muted/20"
            >
              <p className="text-2xl mb-2">🔍</p>
              <p className="text-lg text-muted-foreground mb-2">Nenhum jogo desta liga no momento</p>
              <button
                onClick={() => setSelectedFilter("all")}
                className="text-premium-gold hover:underline text-sm font-medium"
              >
                Ver todas as ligas
              </button>
            </motion.div>
          )}

          {/* Games Grid */}
          {filteredGames.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filteredGames.map((game, index) => (
                <motion.div
                  key={`${game.id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${getLeagueGradient(game.league)} border border-border/50 backdrop-blur-sm`}
                >
                  {/* Live Badge */}
                  {game.isLive && (
                    <div className="absolute top-3 right-3 z-10">
                      <div className="flex items-center gap-1.5 bg-red-600 px-3 py-1 rounded-full shadow-lg">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        <span className="text-white text-xs font-bold uppercase">Ao Vivo</span>
                        <Zap className="w-3 h-3 text-yellow-300" />
                      </div>
                    </div>
                  )}

                  <div className="p-5">
                    {/* League */}
                    <div className="flex items-center gap-2 mb-4">
                      <Trophy className="w-4 h-4 text-premium-gold" />
                      <span className="text-sm font-semibold text-foreground truncate">{game.league}</span>
                    </div>

                    {/* Teams */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-center flex-1">
                        {game.homeLogo ? (
                          <img src={game.homeLogo} alt={game.homeTeam} className="w-12 h-12 mx-auto object-contain mb-2" loading="lazy" />
                        ) : (
                          <div className="w-12 h-12 mx-auto rounded-full bg-premium-gold/20 flex items-center justify-center mb-2">
                            <span className="text-lg">⚽</span>
                          </div>
                        )}
                        <p className="font-bold text-sm text-foreground truncate max-w-[90px] mx-auto">{game.homeTeam}</p>
                        {game.isLive && game.homeScore !== null && (
                          <p className="text-2xl font-black text-premium-gold mt-1">{game.homeScore}</p>
                        )}
                      </div>

                      <div className="px-3 flex flex-col items-center">
                        {game.isLive && game.homeScore !== null ? (
                          <span className="text-xl font-black text-muted-foreground">-</span>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-premium-gold/20 flex items-center justify-center border border-premium-gold/30">
                            <span className="text-xs font-black text-premium-gold">VS</span>
                          </div>
                        )}
                      </div>

                      <div className="text-center flex-1">
                        {game.awayLogo ? (
                          <img src={game.awayLogo} alt={game.awayTeam} className="w-12 h-12 mx-auto object-contain mb-2" loading="lazy" />
                        ) : (
                          <div className="w-12 h-12 mx-auto rounded-full bg-premium-gold/20 flex items-center justify-center mb-2">
                            <span className="text-lg">⚽</span>
                          </div>
                        )}
                        <p className="font-bold text-sm text-foreground truncate max-w-[90px] mx-auto">{game.awayTeam}</p>
                        {game.isLive && game.awayScore !== null && (
                          <p className="text-2xl font-black text-premium-gold mt-1">{game.awayScore}</p>
                        )}
                      </div>
                    </div>

                    {/* Time & Status */}
                    <div className="flex items-center justify-between text-sm border-t border-border/30 pt-3">
                      <span className="text-muted-foreground">{game.date}</span>
                      <span className={`font-semibold ${game.isLive ? 'text-red-400' : 'text-green-400'}`}>
                        {game.isLive ? game.status : game.time}
                      </span>
                    </div>

                    {/* WhatsApp CTA */}
                    <a
                      href={`https://wa.me/5521966238378?text=${encodeURIComponent(`Olá! Quero assistir ${game.homeTeam} x ${game.awayTeam} ao vivo!`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Assistir no WhatsApp
                    </a>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* CTA */}
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
