export async function GET() {
  const res = await fetch("https://api.football-data.org/v4/competitions/2021/matches", {
    headers: {
      "X-Auth-Token": process.env.FOOTBALL_API_KEY,
    },
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
    });
  }

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
