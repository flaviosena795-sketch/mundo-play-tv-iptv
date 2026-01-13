import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SportsDBEvent {
  idEvent: string;
  strEvent: string;
  strLeague: string;
  strHomeTeam: string;
  strAwayTeam: string;
  strHomeTeamBadge: string | null;
  strAwayTeamBadge: string | null;
  dateEvent: string;
  strTime: string;
  strStatus: string | null;
  intHomeScore: string | null;
  intAwayScore: string | null;
}

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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching games from TheSportsDB...');
    
    const allGames: GameData[] = [];
    const today = new Date();

    // Fetch games for today and next 2 days
    for (let i = 0; i <= 2; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      const url = `https://www.thesportsdb.com/api/v1/json/1/eventsday.php?d=${dateStr}&s=Soccer`;
      console.log(`Fetching: ${url}`);
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`Day ${dateStr}: ${data.events?.length || 0} events`);
        
        if (data.events && Array.isArray(data.events)) {
          data.events.forEach((event: SportsDBEvent) => {
            const game = formatGame(event, today);
            if (game) {
              allGames.push(game);
            }
          });
        }
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log(`Total games collected: ${allGames.length}`);

    // Sort: live games first, then by date/time
    allGames.sort((a, b) => {
      if (a.isLive && !b.isLive) return -1;
      if (!a.isLive && b.isLive) return 1;
      return 0;
    });

    // Limit to 12 games
    const limitedGames = allGames.slice(0, 12);

    return new Response(JSON.stringify({ games: limitedGames }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching games:', error);
    return new Response(
      JSON.stringify({ error: error.message, games: [] }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function formatGame(event: SportsDBEvent, today: Date): GameData | null {
  if (!event.strHomeTeam || !event.strAwayTeam) return null;

  const eventDate = new Date(event.dateEvent);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  let dateStr: string;
  if (eventDate.toDateString() === today.toDateString()) {
    dateStr = 'Hoje';
  } else if (eventDate.toDateString() === tomorrow.toDateString()) {
    dateStr = 'Amanhã';
  } else {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    dateStr = days[eventDate.getDay()] + ', ' + eventDate.getDate() + '/' + (eventDate.getMonth() + 1);
  }

  // Check if game is live
  const liveStatuses = ['1H', '2H', 'HT', 'ET', 'P', 'Live', 'In Progress'];
  const isLive = event.strStatus ? liveStatuses.some(s => event.strStatus?.includes(s)) : false;

  // Format time (strTime is in HH:MM:SS format)
  let time = '00:00';
  if (event.strTime) {
    const timeParts = event.strTime.split(':');
    time = `${timeParts[0]}:${timeParts[1]}`;
  }

  return {
    id: parseInt(event.idEvent) || Math.random() * 100000,
    sport: 'Futebol',
    league: event.strLeague || 'Liga',
    homeTeam: event.strHomeTeam,
    awayTeam: event.strAwayTeam,
    homeLogo: event.strHomeTeamBadge || '',
    awayLogo: event.strAwayTeamBadge || '',
    date: dateStr,
    time: time,
    isLive: isLive,
    status: event.strStatus || 'Scheduled',
    homeScore: event.intHomeScore ? parseInt(event.intHomeScore) : null,
    awayScore: event.intAwayScore ? parseInt(event.intAwayScore) : null,
  };
}
