export async function GET() {
  try {
    // Fetch from multiple leagues simultaneously
    const [uclRes, plRes, laLigaRes, bundesligaRes] = await Promise.all([
      fetch("https://api.football-data.org/v4/competitions/2001/matches", {
        headers: { "X-Auth-Token": process.env.FOOTBALL_API_KEY },
      }),
      fetch("https://api.football-data.org/v4/competitions/2021/matches", {
        headers: { "X-Auth-Token": process.env.FOOTBALL_API_KEY },
      }),
      fetch("https://api.football-data.org/v4/competitions/2014/matches", {
        headers: { "X-Auth-Token": process.env.FOOTBALL_API_KEY },
      }),
      fetch("https://api.football-data.org/v4/competitions/2002/matches", {
        headers: { "X-Auth-Token": process.env.FOOTBALL_API_KEY },
      })
    ]);

    const [uclData, plData, laLigaData, bundesligaData] = await Promise.all([
      uclRes.ok ? uclRes.json() : { matches: [] },
      plRes.ok ? plRes.json() : { matches: [] },
      laLigaRes.ok ? laLigaRes.json() : { matches: [] },
      bundesligaRes.ok ? bundesligaRes.json() : { matches: [] }
    ]);

    // Combine all matches and add league info
    const allMatches = [
      ...(uclData.matches || []).map(match => ({ ...match, league: 'UEFA Champions League' })),
      ...(plData.matches || []).map(match => ({ ...match, league: 'Premier League' })),
      ...(laLigaData.matches || []).map(match => ({ ...match, league: 'La Liga' })),
      ...(bundesligaData.matches || []).map(match => ({ ...match, league: 'Bundesliga' }))
    ];

    return new Response(JSON.stringify({ matches: allMatches }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error('Error fetching matches:', error);
    return new Response(JSON.stringify({ error: "Failed to fetch data", matches: [] }), {
      status: 500,
    });
  }
}
