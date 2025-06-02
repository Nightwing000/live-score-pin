import MatchCard from "@/app/components/Matchcard";

export default async function MatchPage({ params }) {
  const matchId = params.id;
  const res = await fetch(`https://api.football-data.org/v4/matches/${matchId}`, {
    headers: { "X-Auth-Token": process.env.FOOTBALL_API_KEY },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    return <p>Error fetching match data</p>;
  }
  const match = await res.json();
  console.log(match);

  return <MatchCard match={match} />;
}
