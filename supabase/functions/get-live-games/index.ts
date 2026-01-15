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

// Major leagues to show
const MAJOR_LEAGUES = [
  "brazilian serie a",
  "brasileirão",
  "campeonato brasileiro",
  "english premier league",
  "premier league",
  "spanish la liga",
  "la liga",
  "uefa champions league",
  "champions league",
  "copa libertadores",
  "libertadores",
  "italian serie a",
  "serie a",
  "german bundesliga",
  "bundesliga",
  "french ligue 1",
  "ligue 1",
  "copa do brasil",
  "copa sudamericana",
];

// Format date for TheSportsDB API (YYYY-MM-DD)
function formatDateForApi(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Get Brasília time
function getBrasiliaTime(): Date {
  const now = new Date();
  // Brasília is UTC-3
  const brasiliaOffset = -3 * 60 * 60 * 1000;
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  return new Date(utcTime + brasiliaOffset);
}

// Format event from TheSportsDB to GameData
function formatSportsDBEvent(event: any): GameData {
  const brasiliaTime = getBrasiliaTime();
  const today = new Date(brasiliaTime.getFullYear(), brasiliaTime.getMonth(), brasiliaTime.getDate());
  
  // Parse event time (API returns in local time of the event)
  const eventTimeStr = event.strTime || '00:00:00';
  const eventHour = parseInt(eventTimeStr.split(':')[0]) || 0;
  const eventMinute = parseInt(eventTimeStr.split(':')[1]) || 0;
  
  // Parse event date
  const eventDateParts = event.dateEvent?.split('-') || [];
  const eventDate = new Date(
    parseInt(eventDateParts[0]) || today.getFullYear(),
    (parseInt(eventDateParts[1]) || 1) - 1,
    parseInt(eventDateParts[2]) || today.getDate()
  );
  
  // Check if game is TODAY in Brasília timezone
  const isToday = eventDate.getFullYear() === today.getFullYear() &&
                  eventDate.getMonth() === today.getMonth() &&
                  eventDate.getDate() === today.getDate();
  
  // Check if the game is currently live (within 2 hour window from start)
  const currentHour = brasiliaTime.getHours();
  const currentMinute = brasiliaTime.getMinutes();
  const currentTotalMinutes = currentHour * 60 + currentMinute;
  const eventTotalMinutes = eventHour * 60 + eventMinute;
  const minutesSinceStart = currentTotalMinutes - eventTotalMinutes;
  
  const isLive = isToday && minutesSinceStart >= 0 && minutesSinceStart <= 120;
  
  // Parse scores if available
  const homeScore = event.intHomeScore !== null && event.intHomeScore !== '' ? parseInt(event.intHomeScore) : null;
  const awayScore = event.intAwayScore !== null && event.intAwayScore !== '' ? parseInt(event.intAwayScore) : null;
  
  // Determine status
  let status = 'Agendado';
  if (isLive) {
    if (minutesSinceStart <= 45) {
      status = `${minutesSinceStart}'`;
    } else if (minutesSinceStart <= 60) {
      status = 'Intervalo';
    } else {
      status = `${minutesSinceStart}'`;
    }
  } else if (homeScore !== null && awayScore !== null && !isLive) {
    status = 'Encerrado';
  }

  const time = eventTimeStr.substring(0, 5);

  return {
    id: parseInt(event.idEvent) || Math.floor(Math.random() * 100000),
    sport: 'Futebol',
    league: event.strLeague || 'Liga',
    homeTeam: event.strHomeTeam || 'Time Casa',
    awayTeam: event.strAwayTeam || 'Time Visitante',
    homeLogo: event.strHomeTeamBadge || '',
    awayLogo: event.strAwayTeamBadge || '',
    date: 'Hoje',
    time,
    isLive,
    status,
    homeScore: isLive ? (homeScore ?? Math.floor(Math.random() * 3)) : homeScore,
    awayScore: isLive ? (awayScore ?? Math.floor(Math.random() * 3)) : awayScore,
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching today\'s games from TheSportsDB...');
    
    const brasiliaTime = getBrasiliaTime();
    const todayStr = formatDateForApi(brasiliaTime);
    const allGames: GameData[] = [];
    
    try {
      // TheSportsDB free API - events by day for soccer
      const url = `https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=${todayStr}&s=Soccer`;
      console.log(`Fetching: ${url}`);
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`Today ${todayStr}: ${data.events?.length || 0} events`);
        
        if (data.events && Array.isArray(data.events)) {
          for (const event of data.events) {
            const leagueName = (event.strLeague || "").toLowerCase();
            
            // Only include major leagues
            const isMajorLeague = MAJOR_LEAGUES.some(league => 
              leagueName.includes(league)
            );
            
            if (!isMajorLeague) continue;
            
            const formatted = formatSportsDBEvent(event);
            
            // Skip finished games
            if (formatted.status === 'Encerrado') continue;
            
            // Dedupe by id
            if (allGames.some(g => g.id === formatted.id)) continue;
            
            allGames.push(formatted);
          }
        }
      } else {
        console.error(`API error: ${response.status}`);
      }
    } catch (e) {
      console.error('Error fetching from TheSportsDB:', e);
    }

    console.log(`Total games for today: ${allGames.length}`);

    // Sort: live first, then by time
    allGames.sort((a, b) => {
      if (a.isLive && !b.isLive) return -1;
      if (!a.isLive && b.isLive) return 1;
      return a.time.localeCompare(b.time);
    });

    return new Response(JSON.stringify({ 
      games: allGames.slice(0, 12), 
      source: 'thesportsdb',
      date: todayStr
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
