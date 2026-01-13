import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

// Generate dynamic fallback games with realistic data
function generateFallbackGames(): GameData[] {
  const now = new Date();
  
  const getDayLabel = (daysFromNow: number): string => {
    const date = new Date(now);
    date.setDate(date.getDate() + daysFromNow);
    
    if (daysFromNow === 0) return "Hoje";
    if (daysFromNow === 1) return "Amanhã";
    
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    return `${days[date.getDay()]}, ${date.getDate()}/${date.getMonth() + 1}`;
  };

  const games: GameData[] = [
    {
      id: 1,
      sport: "Futebol",
      league: "Brasileirão Série A",
      homeTeam: "Flamengo",
      awayTeam: "Palmeiras",
      homeLogo: "",
      awayLogo: "",
      date: getDayLabel(0),
      time: "21:30",
      isLive: now.getHours() >= 21 && now.getHours() < 24,
      status: now.getHours() >= 21 ? "2º Tempo" : "Agendado",
      homeScore: now.getHours() >= 21 ? 2 : null,
      awayScore: now.getHours() >= 21 ? 1 : null,
    },
    {
      id: 2,
      sport: "Futebol",
      league: "Champions League",
      homeTeam: "Real Madrid",
      awayTeam: "Manchester City",
      homeLogo: "",
      awayLogo: "",
      date: getDayLabel(1),
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
      date: getDayLabel(1),
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
      awayTeam: "Atlético Madrid",
      homeLogo: "",
      awayLogo: "",
      date: getDayLabel(2),
      time: "17:00",
      isLive: false,
      status: "Agendado",
      homeScore: null,
      awayScore: null,
    },
    {
      id: 5,
      sport: "Futebol",
      league: "Copa Libertadores",
      homeTeam: "Boca Juniors",
      awayTeam: "River Plate",
      homeLogo: "",
      awayLogo: "",
      date: getDayLabel(2),
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
      date: getDayLabel(3),
      time: "18:30",
      isLive: false,
      status: "Agendado",
      homeScore: null,
      awayScore: null,
    },
    {
      id: 7,
      sport: "Futebol",
      league: "Brasileirão Série A",
      homeTeam: "Fluminense",
      awayTeam: "Botafogo",
      homeLogo: "",
      awayLogo: "",
      date: getDayLabel(3),
      time: "20:00",
      isLive: false,
      status: "Agendado",
      homeScore: null,
      awayScore: null,
    },
    {
      id: 8,
      sport: "Futebol",
      league: "Champions League",
      homeTeam: "PSG",
      awayTeam: "Bayern Munich",
      homeLogo: "",
      awayLogo: "",
      date: getDayLabel(4),
      time: "16:00",
      isLive: false,
      status: "Agendado",
      homeScore: null,
      awayScore: null,
    },
    {
      id: 9,
      sport: "Futebol",
      league: "Premier League",
      homeTeam: "Chelsea",
      awayTeam: "Manchester City",
      homeLogo: "",
      awayLogo: "",
      date: getDayLabel(4),
      time: "12:00",
      isLive: false,
      status: "Agendado",
      homeScore: null,
      awayScore: null,
    },
  ];

  return games;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Generating fallback games...');
    
    const games = generateFallbackGames();
    
    console.log(`Generated ${games.length} games`);

    return new Response(JSON.stringify({ games }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message, games: [] }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
