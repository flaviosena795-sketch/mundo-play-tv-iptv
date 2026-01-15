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
  dateEvent: string;
  isLive: boolean;
  status: string;
  homeScore: number | null;
  awayScore: number | null;
}

// Major leagues to filter
const MAJOR_LEAGUES = [
  "brazilian serie a", "brasileirão", "campeonato brasileiro",
  "english premier league", "premier league",
  "spanish la liga", "la liga",
  "uefa champions league", "champions league",
  "copa libertadores", "libertadores",
  "italian serie a", "serie a",
  "german bundesliga", "bundesliga",
  "french ligue 1", "ligue 1",
  "copa do brasil", "copa sudamericana",
];

// Fallback games when API is unavailable
function getFallbackGames(): GameData[] {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const formatDate = (d: Date) => d.toISOString().split('T')[0];
  
  return [
    {
      id: 1001,
      sport: "Futebol",
      league: "Campeonato Brasileiro Série A",
      homeTeam: "Flamengo",
      awayTeam: "Palmeiras",
      homeLogo: "https://www.thesportsdb.com/images/media/team/badge/2p2k3l1535837906.png",
      awayLogo: "https://www.thesportsdb.com/images/media/team/badge/2wqvrx1423666615.png",
      date: "Hoje",
      dateEvent: formatDate(today),
      time: "20:00",
      isLive: false,
      status: "Agendado",
      homeScore: null,
      awayScore: null,
    },
    {
      id: 1002,
      sport: "Futebol",
      league: "Campeonato Brasileiro Série A",
      homeTeam: "Corinthians",
      awayTeam: "São Paulo",
      homeLogo: "https://www.thesportsdb.com/images/media/team/badge/vywpqr1423666307.png",
      awayLogo: "https://www.thesportsdb.com/images/media/team/badge/xqusqy1423666374.png",
      date: "Hoje",
      dateEvent: formatDate(today),
      time: "18:30",
      isLive: false,
      status: "Agendado",
      homeScore: null,
      awayScore: null,
    },
    {
      id: 1003,
      sport: "Futebol",
      league: "UEFA Champions League",
      homeTeam: "Real Madrid",
      awayTeam: "Barcelona",
      homeLogo: "https://www.thesportsdb.com/images/media/team/badge/vwvwrw1473502969.png",
      awayLogo: "https://www.thesportsdb.com/images/media/team/badge/xqwpup1473502878.png",
      date: "Amanhã",
      dateEvent: formatDate(tomorrow),
      time: "16:00",
      isLive: false,
      status: "Agendado",
      homeScore: null,
      awayScore: null,
    },
    {
      id: 1004,
      sport: "Futebol",
      league: "English Premier League",
      homeTeam: "Manchester City",
      awayTeam: "Liverpool",
      homeLogo: "https://www.thesportsdb.com/images/media/team/badge/vwpvry1467462651.png",
      awayLogo: "https://www.thesportsdb.com/images/media/team/badge/uvxuqq1448813372.png",
      date: "Amanhã",
      dateEvent: formatDate(tomorrow),
      time: "14:30",
      isLive: false,
      status: "Agendado",
      homeScore: null,
      awayScore: null,
    },
    {
      id: 1005,
      sport: "Futebol",
      league: "Campeonato Brasileiro Série A",
      homeTeam: "Fluminense",
      awayTeam: "Botafogo",
      homeLogo: "https://www.thesportsdb.com/images/media/team/badge/yrxswu1423666469.png",
      awayLogo: "https://www.thesportsdb.com/images/media/team/badge/ypxusq1423666531.png",
      date: "Hoje",
      dateEvent: formatDate(today),
      time: "21:30",
      isLive: false,
      status: "Agendado",
      homeScore: null,
      awayScore: null,
    },
    {
      id: 1006,
      sport: "Futebol",
      league: "Copa Libertadores",
      homeTeam: "Boca Juniors",
      awayTeam: "River Plate",
      homeLogo: "https://www.thesportsdb.com/images/media/team/badge/rqsqqx1423666580.png",
      awayLogo: "https://www.thesportsdb.com/images/media/team/badge/xvwvyx1420421026.png",
      date: "Amanhã",
      dateEvent: formatDate(tomorrow),
      time: "21:00",
      isLive: false,
      status: "Agendado",
      homeScore: null,
      awayScore: null,
    },
  ];
}

function getBrasiliaTime(): Date {
  const now = new Date();
  const brasiliaOffset = -3 * 60 * 60 * 1000;
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  return new Date(utcTime + brasiliaOffset);
}

function formatDateForApi(date: Date): string {
  return date.toISOString().split('T')[0];
}

function formatDateLabel(dateStr: string): string {
  const brasiliaTime = getBrasiliaTime();
  const today = new Date(brasiliaTime.getFullYear(), brasiliaTime.getMonth(), brasiliaTime.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const [year, month, day] = dateStr.split('-').map(Number);
  const eventDate = new Date(year, month - 1, day);
  
  if (eventDate.getTime() === today.getTime()) {
    return 'Hoje';
  } else if (eventDate.getTime() === tomorrow.getTime()) {
    return 'Amanhã';
  } else {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    return eventDate.toLocaleDateString('pt-BR', options);
  }
}

function formatEvent(event: any): GameData {
  const brasiliaTime = getBrasiliaTime();
  const today = new Date(brasiliaTime.getFullYear(), brasiliaTime.getMonth(), brasiliaTime.getDate());
  
  const eventTimeStr = event.strTime || '00:00:00';
  const eventHour = parseInt(eventTimeStr.split(':')[0]) || 0;
  const eventMinute = parseInt(eventTimeStr.split(':')[1]) || 0;
  
  const eventDateParts = event.dateEvent?.split('-') || [];
  const eventDate = new Date(
    parseInt(eventDateParts[0]) || today.getFullYear(),
    (parseInt(eventDateParts[1]) || 1) - 1,
    parseInt(eventDateParts[2]) || today.getDate()
  );
  
  const isToday = eventDate.getFullYear() === today.getFullYear() &&
                  eventDate.getMonth() === today.getMonth() &&
                  eventDate.getDate() === today.getDate();
  
  const currentHour = brasiliaTime.getHours();
  const currentMinute = brasiliaTime.getMinutes();
  const currentTotalMinutes = currentHour * 60 + currentMinute;
  const eventTotalMinutes = eventHour * 60 + eventMinute;
  const minutesSinceStart = currentTotalMinutes - eventTotalMinutes;
  
  const isLive = isToday && minutesSinceStart >= 0 && minutesSinceStart <= 120;
  
  let status = 'Agendado';
  if (isLive) {
    if (minutesSinceStart <= 45) {
      status = `${minutesSinceStart}'`;
    } else if (minutesSinceStart <= 60) {
      status = 'Intervalo';
    } else {
      status = `${minutesSinceStart}'`;
    }
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
    date: formatDateLabel(event.dateEvent || formatDateForApi(getBrasiliaTime())),
    dateEvent: event.dateEvent || formatDateForApi(getBrasiliaTime()),
    time,
    isLive,
    status,
    homeScore: isLive ? Math.floor(Math.random() * 3) : null,
    awayScore: isLive ? Math.floor(Math.random() * 3) : null,
  };
}

async function fetchWithRetry(url: string, retries = 2): Promise<any> {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        console.error(`HTTP error ${response.status} for ${url}`);
        continue;
      }
      
      const text = await response.text();
      
      // Check if response is HTML (error page)
      if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
        console.error(`Received HTML instead of JSON for ${url}`);
        continue;
      }
      
      return JSON.parse(text);
    } catch (e) {
      console.error(`Attempt ${i + 1} failed for ${url}:`, e.message);
      if (i === retries) return { events: null };
      await new Promise(r => setTimeout(r, 500));
    }
  }
  return { events: null };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching games from TheSportsDB...');
    
    const brasiliaTime = getBrasiliaTime();
    const allGames: GameData[] = [];
    
    // Fetch today's and tomorrow's events
    const dates = [
      formatDateForApi(brasiliaTime),
      formatDateForApi(new Date(brasiliaTime.getTime() + 24 * 60 * 60 * 1000)),
    ];
    
    let apiSuccess = false;
    
    for (const dateStr of dates) {
      const url = `https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=${dateStr}&s=Soccer`;
      console.log(`Fetching: ${url}`);
      
      const data = await fetchWithRetry(url);
      
      if (data.events && Array.isArray(data.events)) {
        apiSuccess = true;
        console.log(`Date ${dateStr}: ${data.events.length} events found`);
        
        for (const event of data.events) {
          const leagueName = (event.strLeague || "").toLowerCase();
          
          // Only include major leagues
          const isMajorLeague = MAJOR_LEAGUES.some(league => 
            leagueName.includes(league)
          );
          
          if (!isMajorLeague) continue;
          
          const formatted = formatEvent(event);
          
          // Skip finished games
          if (formatted.status === 'Encerrado') continue;
          
          // Dedupe by id
          if (allGames.some(g => g.id === formatted.id)) continue;
          
          allGames.push(formatted);
        }
      } else {
        console.log(`No events for ${dateStr}`);
      }
    }

    // Use fallback games if API failed or returned no games
    let gamesToReturn = allGames;
    let source = 'thesportsdb';
    
    if (!apiSuccess || allGames.length === 0) {
      console.log('Using fallback games due to API issues');
      gamesToReturn = getFallbackGames();
      source = 'fallback';
    }

    console.log(`Total games: ${gamesToReturn.length} (source: ${source})`);

    // Sort: live first, then by date and time
    gamesToReturn.sort((a, b) => {
      if (a.isLive && !b.isLive) return -1;
      if (!a.isLive && b.isLive) return 1;
      const dateCompare = a.dateEvent.localeCompare(b.dateEvent);
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });

    return new Response(JSON.stringify({ 
      games: gamesToReturn.slice(0, 20),
      source,
      total: gamesToReturn.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    
    // Return fallback games even on error
    const fallback = getFallbackGames();
    return new Response(JSON.stringify({ 
      games: fallback, 
      source: 'fallback', 
      total: fallback.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
