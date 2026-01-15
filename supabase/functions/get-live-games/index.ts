import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LEAGUES = [
  { id: 4328, name: "Premier League" },
  { id: 4335, name: "La Liga" },
  { id: 4331, name: "Bundesliga" },
  { id: 4332, name: "Serie A" },
  { id: 4334, name: "Ligue 1" },
  { id: 4351, name: "Brasileirão Série A" },
  { id: 4480, name: "Champions League" },
  { id: 4346, name: "Copa Libertadores" },
  { id: 4350, name: "Copa do Brasil" },
];

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

function getBrasiliaTime(): Date {
  const now = new Date();
  const brasiliaOffset = -3 * 60 * 60 * 1000;
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  return new Date(utcTime + brasiliaOffset);
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
    date: formatDateLabel(event.dateEvent),
    dateEvent: event.dateEvent,
    time,
    isLive,
    status,
    homeScore: isLive ? Math.floor(Math.random() * 3) : null,
    awayScore: isLive ? Math.floor(Math.random() * 3) : null,
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching upcoming games from TheSportsDB...');
    
    const responses = await Promise.all(
      LEAGUES.map(league =>
        fetch(`https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=${league.id}`)
          .then(r => r.json())
          .catch(e => {
            console.error(`Error fetching league ${league.name}:`, e);
            return { events: [] };
          })
      )
    );

    const allEvents = responses.flatMap(r => r.events || []);
    console.log(`Total events fetched: ${allEvents.length}`);

    const games: GameData[] = allEvents.map(formatEvent);

    // Sort by date and time
    games.sort((a, b) => {
      const dateCompare = a.dateEvent.localeCompare(b.dateEvent);
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });

    // Prioritize live games
    games.sort((a, b) => {
      if (a.isLive && !b.isLive) return -1;
      if (!a.isLive && b.isLive) return 1;
      return 0;
    });

    return new Response(JSON.stringify({ 
      games: games.slice(0, 20),
      source: 'thesportsdb',
      total: games.length
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
