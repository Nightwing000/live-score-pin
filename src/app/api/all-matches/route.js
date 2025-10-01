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

    // Debug logging
    console.log('UCL matches:', uclData.matches?.length || 0);
    console.log('Premier League matches:', plData.matches?.length || 0);
    console.log('La Liga matches:', laLigaData.matches?.length || 0);
    console.log('Bundesliga matches:', bundesligaData.matches?.length || 0);
    
    // Debug UCL response status
    console.log('UCL API status:', uclRes.status);
    console.log('UCL API ok:', uclRes.ok);
    
    // Check UCL match statuses
    if (uclData.matches?.length > 0) {
      const uclStatuses = {};
      uclData.matches.forEach(match => {
        uclStatuses[match.status] = (uclStatuses[match.status] || 0) + 1;
      });
      console.log('UCL match statuses:', uclStatuses);
      
      // Find scheduled UCL matches
      const scheduledUCL = uclData.matches.filter(m => m.status === 'SCHEDULED');
      console.log('Scheduled UCL matches:', scheduledUCL.length);
      
      if (scheduledUCL.length > 0) {
        console.log('Next UCL match:', {
          home: scheduledUCL[0].homeTeam.name,
          away: scheduledUCL[0].awayTeam.name,
          date: scheduledUCL[0].utcDate,
          status: scheduledUCL[0].status
        });
      }
    } else {
      console.log('UCL response structure:', Object.keys(uclData));
    }

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
