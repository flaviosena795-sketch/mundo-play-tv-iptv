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

// Generate fallback games
function generateFallbackGames(): GameData[] {
  const now = new Date();
  
  const getDayLabel = (daysFromNow: number): string => {
    if (daysFromNow === 0) return "Hoje";
    if (daysFromNow === 1) return "Amanhã";
    const date = new Date(now);
    date.setDate(date.getDate() + daysFromNow);
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    return `${days[date.getDay()]}, ${date.getDate()}/${date.getMonth() + 1}`;
  };

  return [
    { id: 1, sport: "Futebol", league: "Brasileirão Série A", homeTeam: "Flamengo", awayTeam: "Palmeiras", homeLogo: "", awayLogo: "", date: getDayLabel(0), time: "21:30", isLive: now.getHours() >= 21, status: now.getHours() >= 21 ? "2º Tempo" : "Agendado", homeScore: now.getHours() >= 21 ? 2 : null, awayScore: now.getHours() >= 21 ? 1 : null },
    { id: 2, sport: "Futebol", league: "Champions League", homeTeam: "Real Madrid", awayTeam: "Manchester City", homeLogo: "", awayLogo: "", date: getDayLabel(1), time: "16:00", isLive: false, status: "Agendado", homeScore: null, awayScore: null },
    { id: 3, sport: "Futebol", league: "Premier League", homeTeam: "Liverpool", awayTeam: "Arsenal", homeLogo: "", awayLogo: "", date: getDayLabel(1), time: "13:30", isLive: false, status: "Agendado", homeScore: null, awayScore: null },
    { id: 4, sport: "Futebol", league: "La Liga", homeTeam: "Barcelona", awayTeam: "Atlético Madrid", homeLogo: "", awayLogo: "", date: getDayLabel(2), time: "17:00", isLive: false, status: "Agendado", homeScore: null, awayScore: null },
    { id: 5, sport: "Futebol", league: "Copa Libertadores", homeTeam: "Boca Juniors", awayTeam: "River Plate", homeLogo: "", awayLogo: "", date: getDayLabel(2), time: "21:00", isLive: false, status: "Agendado", homeScore: null, awayScore: null },
    { id: 6, sport: "Futebol", league: "Brasileirão Série A", homeTeam: "Corinthians", awayTeam: "São Paulo", homeLogo: "", awayLogo: "", date: getDayLabel(3), time: "18:30", isLive: false, status: "Agendado", homeScore: null, awayScore: null },
    { id: 7, sport: "Futebol", league: "Brasileirão Série A", homeTeam: "Fluminense", awayTeam: "Botafogo", homeLogo: "", awayLogo: "", date: getDayLabel(3), time: "20:00", isLive: false, status: "Agendado", homeScore: null, awayScore: null },
    { id: 8, sport: "Futebol", league: "Champions League", homeTeam: "PSG", awayTeam: "Bayern Munich", homeLogo: "", awayLogo: "", date: getDayLabel(4), time: "16:00", isLive: false, status: "Agendado", homeScore: null, awayScore: null },
    { id: 9, sport: "Futebol", league: "Premier League", homeTeam: "Chelsea", awayTeam: "Manchester City", homeLogo: "", awayLogo: "", date: getDayLabel(4), time: "12:00", isLive: false, status: "Agendado", homeScore: null, awayScore: null },
  ];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rapidApiKey = Deno.env.get('RAPIDAPI_KEY');
    
    if (!rapidApiKey) {
      console.log('RAPIDAPI_KEY not configured, using fallback');
      return new Response(JSON.stringify({ games: generateFallbackGames(), source: 'fallback' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Fetching from API-Football...');

    const headers = new Headers();
    headers.append("x-rapidapi-key", rapidApiKey);
    headers.append("x-rapidapi-host", "api-football-v1.p.rapidapi.com");

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const allGames: GameData[] = [];

    // Try to fetch live games first
    try {
      const liveResponse = await fetch(
        'https://api-football-v1.p.rapidapi.com/v3/fixtures?live=all',
        { method: 'GET', headers }
      );
      
      if (liveResponse.ok) {
        const liveData = await liveResponse.json();
        console.log(`Live games: ${liveData.response?.length || 0}`);
        
        if (liveData.response) {
          liveData.response.slice(0, 6).forEach((fixture: any) => {
            allGames.push(formatApiFootballGame(fixture, today, true));
          });
        }
      } else {
        const errorText = await liveResponse.text();
        console.error(`Live API error: ${liveResponse.status} - ${errorText}`);
      }
    } catch (e) {
      console.error('Error fetching live games:', e);
    }

    // Fetch upcoming games from major leagues
    const leagues = [71, 39, 140, 2, 13]; // Brasileirão, Premier, La Liga, UCL, Libertadores
    const season = today.getFullYear();

    for (const leagueId of leagues) {
      if (allGames.length >= 12) break;
      
      try {
        const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?league=${leagueId}&season=${season}&from=${todayStr}&to=${getDatePlusDays(7)}&status=NS`;
        const response = await fetch(url, { method: 'GET', headers });
        
        if (response.ok) {
          const data = await response.json();
          console.log(`League ${leagueId}: ${data.response?.length || 0} games`);
          
          if (data.response) {
            data.response.slice(0, 3).forEach((fixture: any) => {
              if (!allGames.find(g => g.id === fixture.fixture.id)) {
                allGames.push(formatApiFootballGame(fixture, today, false));
              }
            });
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 250));
      } catch (e) {
        console.error(`Error fetching league ${leagueId}:`, e);
      }
    }

    console.log(`Total API games: ${allGames.length}`);

    if (allGames.length === 0) {
      console.log('No API games found, using fallback');
      return new Response(JSON.stringify({ games: generateFallbackGames(), source: 'fallback' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Sort: live first, then by date
    allGames.sort((a, b) => {
      if (a.isLive && !b.isLive) return -1;
      if (!a.isLive && b.isLive) return 1;
      return 0;
    });

    return new Response(JSON.stringify({ games: allGames.slice(0, 12), source: 'api' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ games: generateFallbackGames(), source: 'fallback', error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function formatApiFootballGame(fixture: any, today: Date, isLive: boolean): GameData {
  const fixtureDate = new Date(fixture.fixture.date);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  let dateStr: string;
  if (fixtureDate.toDateString() === today.toDateString()) {
    dateStr = 'Hoje';
  } else if (fixtureDate.toDateString() === tomorrow.toDateString()) {
    dateStr = 'Amanhã';
  } else {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    dateStr = `${days[fixtureDate.getDay()]}, ${fixtureDate.getDate()}/${fixtureDate.getMonth() + 1}`;
  }

  const liveStatuses = ['1H', '2H', 'HT', 'ET', 'P', 'LIVE'];
  const isCurrentlyLive = isLive || liveStatuses.includes(fixture.fixture.status.short);

  return {
    id: fixture.fixture.id,
    sport: 'Futebol',
    league: fixture.league.name,
    homeTeam: fixture.teams.home.name,
    awayTeam: fixture.teams.away.name,
    homeLogo: fixture.teams.home.logo || '',
    awayLogo: fixture.teams.away.logo || '',
    date: dateStr,
    time: fixtureDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' }),
    isLive: isCurrentlyLive,
    status: fixture.fixture.status.long,
    homeScore: fixture.goals.home,
    awayScore: fixture.goals.away,
  };
}

function getDatePlusDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}
