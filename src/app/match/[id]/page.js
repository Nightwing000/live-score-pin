import styles from './page.module.css';

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

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>Match Details</h1>
      <div className={styles.teams}>
        <div className={styles.team}>
          <img src={match.homeTeam.crest} alt={match.homeTeam.name} className={styles.crest} />
          <p className={styles.teamName}>{match.homeTeam.name}</p>
        </div>
        <p className={styles.vs}>vs</p>
        <div className={styles.team}>
          <img src={match.awayTeam.crest} alt={match.awayTeam.name} className={styles.crest} />
          <p className={styles.teamName}>{match.awayTeam.name}</p>
        </div>
      </div>
      <p className={styles.date}>
        Date: {new Date(match.utcDate).toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })}
      </p>
      <p className={styles.status}>Status: {match.status}</p>
      <p className={styles.score}>
        Score: {match.score.fullTime.homeTeam} - {match.score.fullTime.awayTeam}
      </p>
    </div>
  );
}
