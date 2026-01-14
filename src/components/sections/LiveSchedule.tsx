import { Calendar, Clock, Tv, Loader2, RefreshCw, Filter, Trophy, Zap } from "lucide-react";
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
  // Premier League
  "Real Madrid": { icon: "👑", primaryColor: "#FEBE10", secondaryColor: "#FFFFFF" },
  "Barcelona": { icon: "🔵", primaryColor: "#A50044", secondaryColor: "#004D98" },
  "Man City": { icon: "🔵", primaryColor: "#6CABDD", secondaryColor: "#1C2C5B" },
  "Manchester City": { icon: "🔵", primaryColor: "#6CABDD", secondaryColor: "#1C2C5B" },
  "Liverpool": { icon: "🔴", primaryColor: "#C8102E", secondaryColor: "#00B2A9" },
  "Arsenal": { icon: "🔴", primaryColor: "#EF0107", secondaryColor: "#063672" },
  "Chelsea": { icon: "🔵", primaryColor: "#034694", secondaryColor: "#DBA111" },
  "Man United": { icon: "🔴", primaryColor: "#DA291C", secondaryColor: "#FBE122" },
  "Manchester United": { icon: "🔴", primaryColor: "#DA291C", secondaryColor: "#FBE122" },
  "Tottenham": { icon: "⚪", primaryColor: "#132257", secondaryColor: "#FFFFFF" },
  // La Liga
  "Atlético": { icon: "🔴", primaryColor: "#CB3524", secondaryColor: "#FFFFFF" },
  "Atlético Madrid": { icon: "🔴", primaryColor: "#CB3524", secondaryColor: "#FFFFFF" },
  // Bundesliga
  "Bayern": { icon: "🔴", primaryColor: "#DC052D", secondaryColor: "#0066B2" },
  "Bayern Munich": { icon: "🔴", primaryColor: "#DC052D", secondaryColor: "#0066B2" },
  "Borussia Dortmund": { icon: "💛", primaryColor: "#FDE100", secondaryColor: "#000000" },
  "Dortmund": { icon: "💛", primaryColor: "#FDE100", secondaryColor: "#000000" },
  "RB Leipzig": { icon: "🔴", primaryColor: "#DD0741", secondaryColor: "#FFFFFF" },
  "Bayer Leverkusen": { icon: "🔴", primaryColor: "#E32221", secondaryColor: "#000000" },
  "Leverkusen": { icon: "🔴", primaryColor: "#E32221", secondaryColor: "#000000" },
  // Serie A (Italy)
  "Juventus": { icon: "⚫", primaryColor: "#000000", secondaryColor: "#FFFFFF" },
  "Milan": { icon: "🔴", primaryColor: "#AC1818", secondaryColor: "#000000" },
  "AC Milan": { icon: "🔴", primaryColor: "#AC1818", secondaryColor: "#000000" },
  "Inter": { icon: "🔵", primaryColor: "#010E80", secondaryColor: "#000000" },
  "Inter Milan": { icon: "🔵", primaryColor: "#010E80", secondaryColor: "#000000" },
  "Napoli": { icon: "🔵", primaryColor: "#12A0D7", secondaryColor: "#FFFFFF" },
  "Roma": { icon: "🟡", primaryColor: "#8E1F2F", secondaryColor: "#F0BC42" },
  "AS Roma": { icon: "🟡", primaryColor: "#8E1F2F", secondaryColor: "#F0BC42" },
  // Ligue 1
  "PSG": { icon: "🔵", primaryColor: "#004170", secondaryColor: "#DA291C" },
  "Paris Saint-Germain": { icon: "🔵", primaryColor: "#004170", secondaryColor: "#DA291C" },
  "Marseille": { icon: "🔵", primaryColor: "#2FAEE0", secondaryColor: "#FFFFFF" },
  "Lyon": { icon: "🔵", primaryColor: "#1B4F9B", secondaryColor: "#ED1C24" },
  "Monaco": { icon: "🔴", primaryColor: "#E2001A", secondaryColor: "#FFFFFF" },
  // Libertadores
  "Boca Juniors": { icon: "💛", primaryColor: "#FFD700", secondaryColor: "#00008B" },
  "River Plate": { icon: "🔴", primaryColor: "#FF0000", secondaryColor: "#FFFFFF" },
};

const getTeamData = (teamName: string) => {
  // Try exact match first
  if (teamData[teamName]) return teamData[teamName];
  // Try partial match
  const key = Object.keys(teamData).find(k => teamName.toLowerCase().includes(k.toLowerCase()));
  return key ? teamData[key] : { icon: "⚽", primaryColor: "#FFB800", secondaryColor: "#1a1a1a" };
};

// Generate dynamic dates based on current date
const generateFallbackGames = (): GameData[] => {
  const now = new Date();
  const today = new Date(now);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const getDayLabel = (date: Date): string => {
    const dayDiff = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (dayDiff === 0) return "Hoje";
    if (dayDiff === 1) return "Amanhã";
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    return `${days[date.getDay()]}, ${date.getDate()}/${date.getMonth() + 1}`;
  };

  const addDays = (days: number): Date => {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    return d;
  };

  return [
    {
      id: 1,
      sport: "Futebol",
      league: "Brasileirão Série A",
      homeTeam: "Flamengo",
      awayTeam: "Palmeiras",
      homeLogo: "",
      awayLogo: "",
      date: getDayLabel(today),
      time: "21:30",
      isLive: now.getHours() >= 21 && now.getHours() < 24,
      status: now.getHours() >= 21 ? "Em andamento" : "Agendado",
      homeScore: now.getHours() >= 21 ? 2 : null,
      awayScore: now.getHours() >= 21 ? 1 : null,
    },
    {
      id: 2,
      sport: "Futebol",
      league: "Champions League",
      homeTeam: "Real Madrid",
      awayTeam: "Man City",
      homeLogo: "",
      awayLogo: "",
      date: getDayLabel(tomorrow),
      time: "16:00",
      isLive: false,
      status: "Agendado",
      homeScore: null,
      awayScore: null,
    },
    {
      id: 3,
      sport: "Futebol",
      league: "English Premier League",
      homeTeam: "Liverpool",
      awayTeam: "Arsenal",
      homeLogo: "",
      awayLogo: "",
      date: getDayLabel(addDays(2)),
      time: "13:30",
      isLive: false,
      status: "Agendado",
      homeScore: null,
      awayScore: null,
    },
    {
      id: 4,
      sport: "Futebol",
      league: "German Bundesliga",
      homeTeam: "Bayern Munich",
      awayTeam: "Borussia Dortmund",
      homeLogo: "",
      awayLogo: "",
      date: getDayLabel(addDays(2)),
      time: "15:30",
      isLive: false,
      status: "Agendado",
      homeScore: null,
      awayScore: null,
    },
    {
      id: 5,
      sport: "Futebol",
      league: "Italian Serie A",
      homeTeam: "Juventus",
      awayTeam: "Inter Milan",
      homeLogo: "",
      awayLogo: "",
      date: getDayLabel(addDays(2)),
      time: "17:00",
      isLive: false,
      status: "Agendado",
      homeScore: null,
      awayScore: null,
    },
    {
      id: 6,
      sport: "Futebol",
      league: "French Ligue 1",
      homeTeam: "PSG",
      awayTeam: "Marseille",
      homeLogo: "",
      awayLogo: "",
      date: getDayLabel(addDays(3)),
      time: "20:45",
      isLive: false,
      status: "Agendado",
      homeScore: null,
      awayScore: null,
    },
    {
      id: 7,
      sport: "Futebol",
      league: "Spanish La Liga",
      homeTeam: "Barcelona",
      awayTeam: "Atlético Madrid",
      homeLogo: "",
      awayLogo: "",
      date: getDayLabel(addDays(3)),
      time: "21:00",
      isLive: false,
      status: "Agendado",
      homeScore: null,
      awayScore: null,
    },
    {
      id: 8,
      sport: "Futebol",
      league: "Copa Libertadores",
      homeTeam: "Boca Juniors",
      awayTeam: "River Plate",
      homeLogo: "",
      awayLogo: "",
      date: getDayLabel(addDays(4)),
      time: "21:00",
      isLive: false,
      status: "Agendado",
      homeScore: null,
      awayScore: null,
    },
    {
      id: 9,
      sport: "Futebol",
      league: "German Bundesliga",
      homeTeam: "RB Leipzig",
      awayTeam: "Bayer Leverkusen",
      homeLogo: "",
      awayLogo: "",
      date: getDayLabel(addDays(4)),
      time: "16:30",
      isLive: false,
      status: "Agendado",
      homeScore: null,
      awayScore: null,
    },
    {
      id: 10,
      sport: "Futebol",
      league: "Italian Serie A",
      homeTeam: "AC Milan",
      awayTeam: "Napoli",
      homeLogo: "",
      awayLogo: "",
      date: getDayLabel(addDays(5)),
      time: "14:00",
      isLive: false,
      status: "Agendado",
      homeScore: null,
      awayScore: null,
    },
    {
      id: 11,
      sport: "Futebol",
      league: "French Ligue 1",
      homeTeam: "Lyon",
      awayTeam: "Monaco",
      homeLogo: "",
      awayLogo: "",
      date: getDayLabel(addDays(5)),
      time: "20:00",
      isLive: false,
      status: "Agendado",
      homeScore: null,
      awayScore: null,
    },
    {
      id: 12,
      sport: "Futebol",
      league: "English Premier League",
      homeTeam: "Chelsea",
      awayTeam: "Man United",
      homeLogo: "",
      awayLogo: "",
      date: getDayLabel(addDays(6)),
      time: "12:00",
      isLive: false,
      status: "Agendado",
      homeScore: null,
      awayScore: null,
    },
  ];
};

// Initialize fallback games
const fallbackGames = generateFallbackGames();

const leagueFilters = [
  { id: "all", label: "Todos", icon: "🏆" },
  { id: "brasileirao", label: "Brasileirão", icon: "🇧🇷", keywords: ["Brasileirão", "Serie A Brazil", "Série A"] },
  { id: "champions", label: "Champions", icon: "⭐", keywords: ["Champions", "UEFA Champions"] },
  { id: "premier", label: "Premier", icon: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", keywords: ["Premier League", "English Premier"] },
  { id: "laliga", label: "La Liga", icon: "🇪🇸", keywords: ["La Liga", "LaLiga", "Spanish"] },
  { id: "bundesliga", label: "Bundesliga", icon: "🇩🇪", keywords: ["Bundesliga", "German"] },
  { id: "seriea", label: "Serie A", icon: "🇮🇹", keywords: ["Serie A Italy", "Italian Serie A", "Serie A TIM"] },
  { id: "ligue1", label: "Ligue 1", icon: "🇫🇷", keywords: ["Ligue 1", "French Ligue", "Ligue 1 Uber"] },
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
        setError('Jogos de demonstração');
        setGames(fallbackGames);
        return;
      }

      const rawGames: GameData[] = Array.isArray(data?.games) ? data.games : [];

      // A API que alimenta a função pode retornar itens duplicados e/ou jogos já encerrados.
      // Aqui fazemos deduplicação e filtramos partidas finalizadas para evitar “desatualizado”.
      const seen = new Set<number>();
      const cleaned = rawGames
        .filter((g) => {
          if (seen.has(g.id)) return false;
          seen.add(g.id);
          return true;
        })
        .filter((g) => g.isLive || !/encerrado|finalizado/i.test(g.status ?? ""));

      if (cleaned.length > 0) {
        setGames(cleaned);
        setLastUpdated(new Date());
        if (data?.source === 'fallback') setError('Jogos de demonstração');
      } else {
        setGames(fallbackGames);
        setError('Jogos de demonstração');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Jogos de demonstração');
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
    const leagueLower = league.toLowerCase();
    if (leagueLower.includes('brasileirão') || leagueLower.includes('série a')) {
      return "from-green-500/20 to-yellow-600/10 border-green-500/30";
    }
    if (leagueLower.includes('champions')) {
      return "from-blue-500/20 to-blue-600/10 border-blue-500/30";
    }
    if (leagueLower.includes('premier')) {
      return "from-purple-500/20 to-purple-600/10 border-purple-500/30";
    }
    if (leagueLower.includes('la liga') || leagueLower.includes('laliga') || leagueLower.includes('spanish')) {
      return "from-orange-500/20 to-red-600/10 border-orange-500/30";
    }
    if (leagueLower.includes('bundesliga') || leagueLower.includes('german')) {
      return "from-red-500/20 to-yellow-600/10 border-red-500/30";
    }
    if (leagueLower.includes('serie a') || leagueLower.includes('italian')) {
      return "from-green-600/20 to-white/10 border-green-600/30";
    }
    if (leagueLower.includes('ligue 1') || leagueLower.includes('french')) {
      return "from-blue-600/20 to-red-600/10 border-blue-600/30";
    }
    if (leagueLower.includes('libertadores')) {
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
              {filteredGames.map((game, index) => {
                const homeTeamData = getTeamData(game.homeTeam);
                const awayTeamData = getTeamData(game.awayTeam);
                
                return (
                  <motion.div
                    key={`${game.id}-${index}`}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${getLeagueColor(
                      game.league
                    )} border backdrop-blur-sm transition-all duration-500 cursor-pointer`}
                  >
                    {/* Animated background glow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-premium-gold/0 to-premium-gold/0 group-hover:from-premium-gold/5 group-hover:to-transparent transition-all duration-500" />
                    
                    {/* Decorative corner accent */}
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-premium-gold/10 rounded-full blur-2xl group-hover:bg-premium-gold/20 transition-all duration-500" />
                    
                    {/* Live Indicator with pulse animation */}
                    {game.isLive && (
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute top-4 right-4 z-10"
                      >
                        <div className="relative flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-red-500 px-3 py-1.5 rounded-full shadow-lg shadow-red-500/40">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                          </span>
                          <span className="text-white text-xs font-bold uppercase tracking-wider">Ao Vivo</span>
                          <Zap className="w-3 h-3 text-yellow-300 animate-pulse" />
                        </div>
                      </motion.div>
                    )}

                    <div className="relative p-6">
                      {/* League Header */}
                      <div className="flex items-center gap-3 mb-6">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-premium-gold/20 to-premium-gold/5 flex items-center justify-center border border-premium-gold/20">
                            <Trophy className="w-5 h-5 text-premium-gold" />
                          </div>
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

                      {/* Teams Section - Enhanced */}
                      <div className="flex items-center justify-between mb-6 relative">
                        {/* Home Team */}
                        <motion.div 
                          className="text-center flex-1 group/team"
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <div className="relative mx-auto mb-3">
                            {game.homeLogo ? (
                              <div className="relative">
                                <div 
                                  className="absolute inset-0 rounded-full blur-lg opacity-40 transition-opacity group-hover/team:opacity-60"
                                  style={{ backgroundColor: homeTeamData.primaryColor }}
                                />
                                <img 
                                  src={game.homeLogo} 
                                  alt={game.homeTeam}
                                  className="relative w-16 h-16 mx-auto object-contain drop-shadow-lg"
                                  loading="lazy"
                                />
                              </div>
                            ) : (
                              <div 
                                className="relative w-16 h-16 mx-auto rounded-full flex items-center justify-center shadow-lg transition-transform group-hover/team:scale-110"
                                style={{ 
                                  background: `linear-gradient(135deg, ${homeTeamData.primaryColor} 0%, ${homeTeamData.secondaryColor} 100%)`,
                                  boxShadow: `0 8px 20px ${homeTeamData.primaryColor}40`
                                }}
                              >
                                <span className="text-2xl filter drop-shadow">{homeTeamData.icon}</span>
                              </div>
                            )}
                          </div>
                          <p className="font-bold text-foreground text-sm truncate max-w-[90px] mx-auto">
                            {game.homeTeam}
                          </p>
                          {game.isLive && game.homeScore !== null && (
                            <motion.p 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="text-3xl font-black text-premium-gold mt-2 drop-shadow-lg"
                            >
                              {game.homeScore}
                            </motion.p>
                          )}
                        </motion.div>
                        
                        {/* VS Divider */}
                        <div className="px-4 flex flex-col items-center">
                          {game.isLive && game.homeScore !== null ? (
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-2xl font-black text-muted-foreground">-</span>
                              <span className="text-[10px] text-red-400 font-semibold uppercase tracking-wider animate-pulse">
                                {game.status}
                              </span>
                            </div>
                          ) : (
                            <div className="relative">
                              <div className="absolute inset-0 bg-premium-gold/20 rounded-full blur-md" />
                              <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-premium-gold/30 to-premium-gold/10 flex items-center justify-center border border-premium-gold/30">
                                <span className="text-sm font-black text-premium-gold">VS</span>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Away Team */}
                        <motion.div 
                          className="text-center flex-1 group/team"
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <div className="relative mx-auto mb-3">
                            {game.awayLogo ? (
                              <div className="relative">
                                <div 
                                  className="absolute inset-0 rounded-full blur-lg opacity-40 transition-opacity group-hover/team:opacity-60"
                                  style={{ backgroundColor: awayTeamData.primaryColor }}
                                />
                                <img 
                                  src={game.awayLogo} 
                                  alt={game.awayTeam}
                                  className="relative w-16 h-16 mx-auto object-contain drop-shadow-lg"
                                  loading="lazy"
                                />
                              </div>
                            ) : (
                              <div 
                                className="relative w-16 h-16 mx-auto rounded-full flex items-center justify-center shadow-lg transition-transform group-hover/team:scale-110"
                                style={{ 
                                  background: `linear-gradient(135deg, ${awayTeamData.primaryColor} 0%, ${awayTeamData.secondaryColor} 100%)`,
                                  boxShadow: `0 8px 20px ${awayTeamData.primaryColor}40`
                                }}
                              >
                                <span className="text-2xl filter drop-shadow">{awayTeamData.icon}</span>
                              </div>
                            )}
                          </div>
                          <p className="font-bold text-foreground text-sm truncate max-w-[90px] mx-auto">
                            {game.awayTeam}
                          </p>
                          {game.isLive && game.awayScore !== null && (
                            <motion.p 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="text-3xl font-black text-premium-gold mt-2 drop-shadow-lg"
                            >
                              {game.awayScore}
                            </motion.p>
                          )}
                        </motion.div>
                      </div>

                      {/* Date & Time - Enhanced */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-premium-gold" />
                          </div>
                          <span className="text-sm font-medium text-foreground/80">{game.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-premium-gold/10 flex items-center justify-center">
                            <Clock className="w-4 h-4 text-premium-gold" />
                          </div>
                          <span className="text-sm font-bold text-premium-gold">{game.time}</span>
                        </div>
                      </div>
                      
                      {/* Hover CTA */}
                      <motion.div 
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                      >
                        <a
                          href="https://wa.me/5521966238378?text=Olá!%20Quero%20assistir%20esportes%20ao%20vivo!"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full bg-premium-gold text-black font-bold py-2.5 rounded-lg hover:bg-premium-gold-hover transition-colors text-sm"
                        >
                          <Tv className="w-4 h-4" />
                          Assistir Agora
                        </a>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
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
