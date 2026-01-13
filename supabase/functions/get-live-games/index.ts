import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Fixture {
  fixture: {
    id: number;
    date: string;
    status: {
      short: string;
      long: string;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
  };
  teams: {
    home: {
      id: number;
      name: string;
      logo: string;
    };
    away: {
      id: number;
      name: string;
      logo: string;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
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
    const rapidApiKey = Deno.env.get('RAPIDAPI_KEY');
    
    if (!rapidApiKey) {
      console.error('RAPIDAPI_KEY not configured');
      throw new Error('RAPIDAPI_KEY not configured');
    }

    console.log('Starting to fetch games with API key...');

    const headers = new Headers();
    headers.append("x-rapidapi-key", rapidApiKey);
    headers.append("x-rapidapi-host", "api-football-v1.p.rapidapi.com");

    // Get today's date and next 3 days
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Fetch live and upcoming games from major leagues
    // Brasileirão (71), Premier League (39), La Liga (140), Champions League (2), Libertadores (13)
    const leagues = [71, 39, 140, 2, 13];
    const season = today.getFullYear();
    
    console.log(`Fetching games for date: ${todayStr}, season: ${season}`);
    
    const allGames: GameData[] = [];

    // Fetch live games first
    console.log('Fetching live games...');
    const liveResponse = await fetch(
      `https://api-football-v1.p.rapidapi.com/v3/fixtures?live=all`,
      { method: 'GET', headers }
    );
    
    console.log(`Live games response status: ${liveResponse.status}`);
    
    if (liveResponse.ok) {
      const liveData = await liveResponse.json();
      console.log(`Live games found: ${liveData.response?.length || 0}`);
      if (liveData.response && Array.isArray(liveData.response)) {
        liveData.response.forEach((fixture: Fixture) => {
          allGames.push(formatGame(fixture, true));
        });
      }
    } else {
      const errorText = await liveResponse.text();
      console.error(`Live games error: ${errorText}`);
    }

    // Fetch upcoming/scheduled games for each league (NS = Not Started)
    for (const leagueId of leagues) {
      try {
        const url = `https://api-football-v1.p.rapidapi.com/v3/fixtures?league=${leagueId}&season=${season}&from=${todayStr}&to=${getDatePlusDays(3)}`;
        console.log(`Fetching league ${leagueId}: ${url}`);
        
        const response = await fetch(url, { method: 'GET', headers });
        
        console.log(`League ${leagueId} response status: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`League ${leagueId} games found: ${data.response?.length || 0}`);
          if (data.response && Array.isArray(data.response)) {
            data.response.forEach((fixture: Fixture) => {
              // Avoid duplicates
              if (!allGames.find(g => g.id === fixture.fixture.id)) {
                allGames.push(formatGame(fixture, false));
              }
            });
          }
        } else {
          const errorText = await response.text();
          console.error(`League ${leagueId} error: ${errorText}`);
        }
        
        // Small delay between requests to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (err) {
        console.error(`Error fetching league ${leagueId}:`, err);
      }
    }
    
    console.log(`Total games collected: ${allGames.length}`);

    // Sort: live games first, then by date
    allGames.sort((a, b) => {
      if (a.isLive && !b.isLive) return -1;
      if (!a.isLive && b.isLive) return 1;
      return new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime();
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

function formatGame(fixture: Fixture, isLive: boolean): GameData {
  const fixtureDate = new Date(fixture.fixture.date);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  let dateStr: string;
  if (fixtureDate.toDateString() === today.toDateString()) {
    dateStr = 'Hoje';
  } else if (fixtureDate.toDateString() === tomorrow.toDateString()) {
    dateStr = 'Amanhã';
  } else {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    dateStr = days[fixtureDate.getDay()] + ', ' + fixtureDate.getDate() + '/' + (fixtureDate.getMonth() + 1);
  }

  const liveStatuses = ['1H', '2H', 'HT', 'ET', 'P', 'LIVE'];
  const isCurrentlyLive = isLive || liveStatuses.includes(fixture.fixture.status.short);

  return {
    id: fixture.fixture.id,
    sport: 'Futebol',
    league: fixture.league.name,
    homeTeam: fixture.teams.home.name,
    awayTeam: fixture.teams.away.name,
    homeLogo: fixture.teams.home.logo,
    awayLogo: fixture.teams.away.logo,
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
