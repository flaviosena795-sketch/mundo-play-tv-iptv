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

// Format date for TheSportsDB API (YYYY-MM-DD)
function formatDateForApi(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Get date label in Portuguese
function getDateLabel(eventDate: Date, today: Date): string {
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (eventDate.toDateString() === today.toDateString()) {
    return 'Hoje';
  } else if (eventDate.toDateString() === tomorrow.toDateString()) {
    return 'Amanhã';
  } else {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return `${days[eventDate.getDay()]}, ${eventDate.getDate()}/${eventDate.getMonth() + 1}`;
  }
}

// Format event from TheSportsDB to GameData
function formatSportsDBEvent(event: any, today: Date): GameData {
  const eventDate = new Date(event.dateEvent + 'T' + (event.strTime || '00:00:00'));
  const now = new Date();
  
  // Check if the game is currently live (within game time window ~2 hours)
  const gameStart = eventDate.getTime();
  const gameEnd = gameStart + (2 * 60 * 60 * 1000); // 2 hours after start
  const isLive = now.getTime() >= gameStart && now.getTime() <= gameEnd;
  
  // Parse scores if available
  const homeScore = event.intHomeScore !== null && event.intHomeScore !== '' ? parseInt(event.intHomeScore) : null;
  const awayScore = event.intAwayScore !== null && event.intAwayScore !== '' ? parseInt(event.intAwayScore) : null;
  
  // Determine status
  let status = 'Agendado';
  if (isLive) {
    status = 'Ao Vivo';
  } else if (homeScore !== null && awayScore !== null) {
    status = 'Encerrado';
  }

  return {
    id: parseInt(event.idEvent) || Math.random() * 100000,
    sport: 'Futebol',
    league: event.strLeague || 'Liga',
    homeTeam: event.strHomeTeam || 'Time Casa',
    awayTeam: event.strAwayTeam || 'Time Fora',
    homeLogo: event.strHomeTeamBadge || '',
    awayLogo: event.strAwayTeamBadge || '',
    date: getDateLabel(eventDate, today),
    time: event.strTime ? event.strTime.substring(0, 5) : '00:00',
    isLive,
    status,
    homeScore,
    awayScore,
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching from TheSportsDB...');
    
    const today = new Date();
    const allGames: GameData[] = [];
    
    // Fetch games for today and next 7 days
    for (let i = 0; i < 7; i++) {
      if (allGames.length >= 15) break;
      
      const targetDate = new Date(today);
      targetDate.setDate(targetDate.getDate() + i);
      const dateStr = formatDateForApi(targetDate);
      
      try {
        // TheSportsDB free API - events by day for soccer
        const url = `https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=${dateStr}&s=Soccer`;
        console.log(`Fetching: ${url}`);
        
        const response = await fetch(url);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`Day ${dateStr}: ${data.events?.length || 0} events`);
          
          if (data.events && Array.isArray(data.events)) {
            // Filter for major leagues and add to list
            const majorLeagues = [
              'Brazilian Serie A',
              'English Premier League', 
              'Spanish La Liga',
              'UEFA Champions League',
              'Copa Libertadores',
              'Italian Serie A',
              'German Bundesliga',
              'French Ligue 1',
              'Portuguese Primeira Liga',
              'Argentine Primera Division'
            ];
            
            for (const event of data.events) {
              if (allGames.length >= 15) break;
              
              // Check if it's from a major league or just add first available
              const isMajorLeague = majorLeagues.some(league => 
                event.strLeague?.toLowerCase().includes(league.toLowerCase())
              );
              
              // Prioritize major leagues but include others if we don't have enough
              if (isMajorLeague || allGames.length < 9) {
                allGames.push(formatSportsDBEvent(event, today));
              }
            }
          }
        } else {
          console.error(`API error for ${dateStr}: ${response.status}`);
        }
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (e) {
        console.error(`Error fetching day ${dateStr}:`, e);
      }
    }

    console.log(`Total games fetched: ${allGames.length}`);

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

    return new Response(JSON.stringify({ games: allGames.slice(0, 12), source: 'thesportsdb' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ games: generateFallbackGames(), source: 'fallback', error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
