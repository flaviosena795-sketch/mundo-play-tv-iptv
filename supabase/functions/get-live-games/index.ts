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

// Leagues we want to show (API-Football league IDs)
const LEAGUE_IDS = {
  brasileiraoA: 71,      // Brasileirão Série A
  brasileiraoB: 72,      // Brasileirão Série B
  championsLeague: 2,    // UEFA Champions League
  premierLeague: 39,     // English Premier League
  laLiga: 140,           // Spanish La Liga
  serieA: 135,           // Italian Serie A
  bundesliga: 78,        // German Bundesliga
  ligue1: 61,            // French Ligue 1
  libertadores: 13,      // Copa Libertadores
};

// Format date for API-Football (YYYY-MM-DD)
function formatDateForApi(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Get date label in Portuguese with Brasília timezone
function getDateLabel(eventDateStr: string, eventTime: string): string {
  // Parse date and time in Brasília timezone
  const eventDate = new Date(`${eventDateStr}T${eventTime || '00:00'}:00`);
  
  // Get current date in Brasília (UTC-3)
  const now = new Date();
  const brasiliaOffset = -3 * 60; // -3 hours in minutes
  const localOffset = now.getTimezoneOffset();
  const brasiliaTime = new Date(now.getTime() + (localOffset + brasiliaOffset) * 60000);
  
  const today = new Date(brasiliaTime.getFullYear(), brasiliaTime.getMonth(), brasiliaTime.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const gameDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
  
  if (gameDay.getTime() === today.getTime()) {
    return 'Hoje';
  } else if (gameDay.getTime() === tomorrow.getTime()) {
    return 'Amanhã';
  } else {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return `${days[gameDay.getDay()]}, ${gameDay.getDate()}/${gameDay.getMonth() + 1}`;
  }
}

// Map API-Football status to Portuguese
function mapStatus(status: string, elapsed: number | null): { status: string; isLive: boolean } {
  const statusMap: Record<string, { status: string; isLive: boolean }> = {
    'TBD': { status: 'A definir', isLive: false },
    'NS': { status: 'Agendado', isLive: false },
    '1H': { status: elapsed ? `${elapsed}'` : '1º Tempo', isLive: true },
    'HT': { status: 'Intervalo', isLive: true },
    '2H': { status: elapsed ? `${elapsed}'` : '2º Tempo', isLive: true },
    'ET': { status: 'Prorrogação', isLive: true },
    'P': { status: 'Pênaltis', isLive: true },
    'FT': { status: 'Encerrado', isLive: false },
    'AET': { status: 'Encerrado (Prorrogação)', isLive: false },
    'PEN': { status: 'Encerrado (Pênaltis)', isLive: false },
    'BT': { status: 'Intervalo', isLive: true },
    'SUSP': { status: 'Suspenso', isLive: false },
    'INT': { status: 'Interrompido', isLive: true },
    'PST': { status: 'Adiado', isLive: false },
    'CANC': { status: 'Cancelado', isLive: false },
    'ABD': { status: 'Abandonado', isLive: false },
    'AWD': { status: 'WO', isLive: false },
    'WO': { status: 'WO', isLive: false },
    'LIVE': { status: 'Ao Vivo', isLive: true },
  };
  
  return statusMap[status] || { status: status || 'Agendado', isLive: false };
}

// Format fixture from API-Football to GameData
function formatApiFootballFixture(fixture: any): GameData {
  const statusInfo = mapStatus(fixture.fixture.status.short, fixture.fixture.status.elapsed);
  
  // Extract time in HH:MM format (Brasília timezone)
  const kickoffDate = new Date(fixture.fixture.date);
  const hours = kickoffDate.getUTCHours() - 3; // Convert to Brasília (UTC-3)
  const adjustedHours = hours < 0 ? hours + 24 : hours;
  const minutes = kickoffDate.getUTCMinutes();
  const time = `${String(adjustedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  
  const dateStr = fixture.fixture.date.split('T')[0];
  
  return {
    id: fixture.fixture.id,
    sport: 'Futebol',
    league: fixture.league.name,
    homeTeam: fixture.teams.home.name,
    awayTeam: fixture.teams.away.name,
    homeLogo: fixture.teams.home.logo || '',
    awayLogo: fixture.teams.away.logo || '',
    date: getDateLabel(dateStr, time),
    time,
    isLive: statusInfo.isLive,
    status: statusInfo.status,
    homeScore: fixture.goals.home,
    awayScore: fixture.goals.away,
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const API_KEY = Deno.env.get('API_SPORTS_KEY');
    
    if (!API_KEY) {
      console.error('API_SPORTS_KEY not configured');
      return new Response(JSON.stringify({ 
        games: [], 
        source: 'error',
        error: 'API key não configurada' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Fetching from API-Football...');
    
    const today = new Date();
    const allGames: GameData[] = [];
    
    // Fetch fixtures for major leagues
    const leagueIds = Object.values(LEAGUE_IDS);
    
    // Fetch for today and next 7 days
    for (let i = 0; i < 7; i++) {
      if (allGames.length >= 20) break;
      
      const targetDate = new Date(today);
      targetDate.setDate(targetDate.getDate() + i);
      const dateStr = formatDateForApi(targetDate);
      
      // Fetch all leagues for this date in parallel
      const fetchPromises = leagueIds.map(async (leagueId) => {
        try {
          const url = `https://v3.football.api-sports.io/fixtures?league=${leagueId}&date=${dateStr}&timezone=America/Sao_Paulo`;
          console.log(`Fetching: ${url}`);
          
          const response = await fetch(url, {
            headers: {
              'x-apisports-key': API_KEY,
            },
          });
          
          if (!response.ok) {
            console.error(`API error for league ${leagueId}: ${response.status}`);
            return [];
          }
          
          const data = await response.json();
          
          if (data.errors && Object.keys(data.errors).length > 0) {
            console.error(`API errors for league ${leagueId}:`, data.errors);
            return [];
          }
          
          console.log(`League ${leagueId} on ${dateStr}: ${data.response?.length || 0} fixtures`);
          return data.response || [];
        } catch (e) {
          console.error(`Error fetching league ${leagueId}:`, e);
          return [];
        }
      });
      
      const results = await Promise.all(fetchPromises);
      
      for (const fixtures of results) {
        for (const fixture of fixtures) {
          // Skip finished games (keep live + scheduled)
          const status = fixture.fixture.status.short;
          const isFinished = ['FT', 'AET', 'PEN', 'CANC', 'ABD', 'AWD', 'WO', 'PST'].includes(status);
          
          if (isFinished) continue;
          
          // Dedupe by fixture id
          if (allGames.some(g => g.id === fixture.fixture.id)) continue;
          
          allGames.push(formatApiFootballFixture(fixture));
        }
      }
      
      // Small delay between date batches to respect rate limits
      if (i < 6) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    console.log(`Total games fetched: ${allGames.length}`);

    if (allGames.length === 0) {
      console.log('No games found from API');
      return new Response(JSON.stringify({ 
        games: [], 
        source: 'api-football',
        message: 'Nenhum jogo encontrado nas ligas principais para os próximos dias' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Sort: live first, then by date/time
    allGames.sort((a, b) => {
      if (a.isLive && !b.isLive) return -1;
      if (!a.isLive && b.isLive) return 1;
      // For non-live games, sort by date label priority
      const dateOrder = ['Hoje', 'Amanhã'];
      const aDateIdx = dateOrder.indexOf(a.date);
      const bDateIdx = dateOrder.indexOf(b.date);
      if (aDateIdx !== bDateIdx) {
        if (aDateIdx === -1) return 1;
        if (bDateIdx === -1) return -1;
        return aDateIdx - bDateIdx;
      }
      // Same date, sort by time
      return a.time.localeCompare(b.time);
    });

    return new Response(JSON.stringify({ 
      games: allGames.slice(0, 15), 
      source: 'api-football' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      games: [], 
      source: 'error', 
      error: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
