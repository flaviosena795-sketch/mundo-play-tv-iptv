import { Calendar, Clock, Loader2, RefreshCw, Trophy, Zap, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
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

// Team logos/icons mapping for fallback display with team colors
const teamData: Record<string, { icon: string; primaryColor: string; secondaryColor: string }> = {
  // Brasileirão
  "Flamengo": { icon: "🔴", primaryColor: "#E4002B", secondaryColor: "#000000" },
  "Palmeiras": { icon: "💚", primaryColor: "#006437", secondaryColor: "#FFFFFF" },
  "Corinthians": { icon: "⚫", primaryColor: "#000000", secondaryColor: "#FFFFFF" },
  "São Paulo": { icon: "🔴", primaryColor: "#FF0000", secondaryColor: "#000000" },
  "Fluminense": { icon: "🟣", primaryColor: "#7B2D26", secondaryColor: "#006847" },
  "Botafogo": { icon: "⭐", primaryColor: "#000000", secondaryColor: "#FFFFFF" },
  "Santos": { icon: "⚪", primaryColor: "#FFFFFF", secondaryColor: "#000000" },
  "Grêmio": { icon: "🔵", primaryColor: "#0066B3", secondaryColor: "#000000" },
  "Internacional": { icon: "🔴", primaryColor: "#E4002B", secondaryColor: "#FFFFFF" },
  "Atlético-MG": { icon: "⚫", primaryColor: "#000000", secondaryColor: "#FFFFFF" },
  "Vasco": { icon: "⚫", primaryColor: "#000000", secondaryColor: "#FFFFFF" },
  "Cruzeiro": { icon: "🔵", primaryColor: "#003DA5", secondaryColor: "#FFFFFF" },
  // European
  "Real Madrid": { icon: "👑", primaryColor: "#FEBE10", secondaryColor: "#FFFFFF" },
  "Barcelona": { icon: "🔵", primaryColor: "#A50044", secondaryColor: "#004D98" },
  "Man City": { icon: "🔵", primaryColor: "#6CABDD", secondaryColor: "#1C2C5B" },
  "Manchester City": { icon: "🔵", primaryColor: "#6CABDD", secondaryColor: "#1C2C5B" },
  "Liverpool": { icon: "🔴", primaryColor: "#C8102E", secondaryColor: "#00B2A9" },
  "Arsenal": { icon: "🔴", primaryColor: "#EF0107", secondaryColor: "#063672" },
  "Chelsea": { icon: "🔵", primaryColor: "#034694", secondaryColor: "#DBA111" },
  "Bayern": { icon: "🔴", primaryColor: "#DC052D", secondaryColor: "#0066B2" },
  "PSG": { icon: "🔵", primaryColor: "#004170", secondaryColor: "#DA291C" },
  "Juventus": { icon: "⚫", primaryColor: "#000000", secondaryColor: "#FFFFFF" },
  "Milan": { icon: "🔴", primaryColor: "#AC1818", secondaryColor: "#000000" },
  "Inter": { icon: "🔵", primaryColor: "#010E80", secondaryColor: "#000000" },
  // Libertadores
  "Boca Juniors": { icon: "💛", primaryColor: "#FFD700", secondaryColor: "#00008B" },
  "River Plate": { icon: "🔴", primaryColor: "#FF0000", secondaryColor: "#FFFFFF" },
};

const getTeamData = (teamName: string) => {
  if (teamData[teamName]) return teamData[teamName];
  const key = Object.keys(teamData).find(k => teamName.toLowerCase().includes(k.toLowerCase()));
  return key ? teamData[key] : { icon: "⚽", primaryColor: "#FFB800", secondaryColor: "#1a1a1a" };
};

const LiveSchedule = () => {
  const [games, setGames] = useState<GameData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

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

      // Deduplicação defensiva
      const seen = new Set<number>();
      const cleaned = rawGames.filter((g) => {
        if (seen.has(g.id)) return false;
        seen.add(g.id);
        return true;
      });

      setGames(cleaned);
      setLastUpdated(new Date());

      if (cleaned.length === 0) {
        setError("Sem jogos das principais ligas hoje.");
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
    // Refresh every 2 minutes for live scores
    const interval = setInterval(fetchGames, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getLeagueColor = (league: string) => {
    const l = league.toLowerCase();
    if (l.includes('brasileirão') || l.includes('série a') || l.includes('serie a brazil')) {
      return "from-green-500/20 to-yellow-500/10 border-green-500/40";
    }
    if (l.includes('champions')) {
      return "from-blue-600/20 to-indigo-500/10 border-blue-500/40";
    }
    if (l.includes('premier')) {
      return "from-purple-500/20 to-purple-600/10 border-purple-500/40";
    }
    if (l.includes('la liga') || l.includes('laliga')) {
      return "from-orange-500/20 to-red-500/10 border-orange-500/40";
    }
    if (l.includes('bundesliga')) {
      return "from-red-500/20 to-yellow-500/10 border-red-500/40";
    }
    if (l.includes('serie a') && !l.includes('brazil')) {
      return "from-green-600/20 to-emerald-500/10 border-green-600/40";
    }
    if (l.includes('ligue 1')) {
      return "from-blue-500/20 to-red-500/10 border-blue-500/40";
    }
    if (l.includes('libertadores')) {
      return "from-yellow-500/20 to-amber-500/10 border-yellow-500/40";
    }
    return "from-premium-gold/20 to-premium-gold/10 border-premium-gold/40";
  };

  const createWhatsAppLink = (game: GameData) => {
    const message = `Olá! Quero assistir ${game.homeTeam} x ${game.awayTeam} (${game.league}) ao vivo!`;
    return `https://wa.me/5521966238378?text=${encodeURIComponent(message)}`;
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
              Assista aos principais jogos de futebol em qualidade 4K com a <span className="text-premium-gold font-semibold">Mundo Play TV</span>
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
                className="inline-flex items-center gap-1.5 text-xs text-green-400 hover:text-green-300 transition-colors disabled:opacity-50 bg-green-500/10 px-3 py-1.5 rounded-full"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </button>
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && games.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-10 h-10 text-premium-gold animate-spin mb-4" />
              <p className="text-muted-foreground">Carregando jogos de hoje...</p>
            </div>
          )}

          {/* Error/Empty State */}
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

          {/* Games Grid */}
          <AnimatePresence mode="wait">
            {games.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {games.map((game, index) => {
                  const homeTeamInfo = getTeamData(game.homeTeam);
                  const awayTeamInfo = getTeamData(game.awayTeam);
                  
                  return (
                    <motion.div
                      key={`${game.id}-${index}`}
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      whileHover={{ y: -6, scale: 1.02 }}
                      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${getLeagueColor(game.league)} border backdrop-blur-sm`}
                    >
                      {/* Glow effect */}
                      <div className="absolute -top-8 -right-8 w-20 h-20 bg-premium-gold/10 rounded-full blur-2xl group-hover:bg-premium-gold/20 transition-all" />
                      
                      {/* Live Badge */}
                      {game.isLive && (
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="absolute top-3 right-3 z-10"
                        >
                          <div className="flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-red-500 px-3 py-1 rounded-full shadow-lg shadow-red-500/40">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                            </span>
                            <span className="text-white text-xs font-bold uppercase tracking-wider">Ao Vivo</span>
                            <Zap className="w-3 h-3 text-yellow-300" />
                          </div>
                        </motion.div>
                      )}

                      <div className="relative p-5">
                        {/* League Header */}
                        <div className="flex items-center gap-2.5 mb-5">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-premium-gold/20 to-premium-gold/5 flex items-center justify-center border border-premium-gold/20">
                            <Trophy className="w-4 h-4 text-premium-gold" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-premium-gold uppercase tracking-widest font-semibold">
                              {game.sport}
                            </p>
                            <p className="text-sm font-bold text-foreground truncate">
                              {game.league}
                            </p>
                          </div>
                        </div>

                        {/* Teams Section */}
                        <div className="flex items-center justify-between mb-5">
                          {/* Home Team */}
                          <div className="text-center flex-1">
                            <div className="relative mx-auto mb-2">
                              {game.homeLogo ? (
                                <img 
                                  src={game.homeLogo} 
                                  alt={game.homeTeam}
                                  className="w-14 h-14 mx-auto object-contain drop-shadow-lg"
                                  loading="lazy"
                                />
                              ) : (
                                <div 
                                  className="w-14 h-14 mx-auto rounded-full flex items-center justify-center shadow-lg"
                                  style={{ 
                                    background: `linear-gradient(135deg, ${homeTeamInfo.primaryColor} 0%, ${homeTeamInfo.secondaryColor} 100%)`,
                                    boxShadow: `0 6px 16px ${homeTeamInfo.primaryColor}40`
                                  }}
                                >
                                  <span className="text-xl">{homeTeamInfo.icon}</span>
                                </div>
                              )}
                            </div>
                            <p className="font-bold text-foreground text-xs truncate max-w-[80px] mx-auto">
                              {game.homeTeam}
                            </p>
                            {game.isLive && game.homeScore !== null && (
                              <p className="text-2xl font-black text-premium-gold mt-1">
                                {game.homeScore}
                              </p>
                            )}
                          </div>
                          
                          {/* VS / Score */}
                          <div className="px-3 flex flex-col items-center">
                            {game.isLive && game.homeScore !== null ? (
                              <div className="flex flex-col items-center">
                                <span className="text-xl font-black text-muted-foreground">-</span>
                                <span className="text-[10px] text-red-400 font-semibold uppercase animate-pulse">
                                  {game.status}
                                </span>
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-premium-gold/30 to-premium-gold/10 flex items-center justify-center border border-premium-gold/30">
                                <span className="text-xs font-black text-premium-gold">VS</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Away Team */}
                          <div className="text-center flex-1">
                            <div className="relative mx-auto mb-2">
                              {game.awayLogo ? (
                                <img 
                                  src={game.awayLogo} 
                                  alt={game.awayTeam}
                                  className="w-14 h-14 mx-auto object-contain drop-shadow-lg"
                                  loading="lazy"
                                />
                              ) : (
                                <div 
                                  className="w-14 h-14 mx-auto rounded-full flex items-center justify-center shadow-lg"
                                  style={{ 
                                    background: `linear-gradient(135deg, ${awayTeamInfo.primaryColor} 0%, ${awayTeamInfo.secondaryColor} 100%)`,
                                    boxShadow: `0 6px 16px ${awayTeamInfo.primaryColor}40`
                                  }}
                                >
                                  <span className="text-xl">{awayTeamInfo.icon}</span>
                                </div>
                              )}
                            </div>
                            <p className="font-bold text-foreground text-xs truncate max-w-[80px] mx-auto">
                              {game.awayTeam}
                            </p>
                            {game.isLive && game.awayScore !== null && (
                              <p className="text-2xl font-black text-premium-gold mt-1">
                                {game.awayScore}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Time & Date */}
                        <div className="flex items-center justify-between mb-4 py-3 border-t border-white/10">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-foreground/80">{game.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-premium-gold" />
                            <span className="text-sm font-bold text-premium-gold">{game.time}</span>
                          </div>
                        </div>
                        
                        {/* WhatsApp CTA Button - Always visible */}
                        <a
                          href={createWhatsAppLink(game)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-green-600/30 hover:shadow-green-500/40"
                        >
                          <MessageCircle className="w-5 h-5" />
                          Assistir no WhatsApp
                        </a>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <a
              href="https://wa.me/5521966238378?text=Olá!%20Quero%20assinar%20a%20Mundo%20Play%20TV!"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold px-8 py-4 rounded-full hover:from-green-500 hover:to-green-400 transition-all shadow-xl shadow-green-600/30 text-lg"
            >
              <MessageCircle className="w-6 h-6" />
              Assinar Mundo Play TV
            </a>
            <p className="text-sm text-muted-foreground mt-4">
              ✓ 4K Ultra HD • ✓ Sem travamentos • ✓ +20.000 canais
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LiveSchedule;
