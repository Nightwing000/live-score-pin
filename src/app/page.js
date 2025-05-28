'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function HomePage() {
  const [nextMatch, setNextMatch] = useState(null);

  useEffect(() => {
    fetch('/api/ucl')
      .then((res) => res.json())
      .then((data) => {
        const upcoming = data.matches.find((match) => match.status !== 'FINISHED');
        setNextMatch(upcoming);
      });
  }, []);

  if (!nextMatch) return <p>Loading next match...</p>;

  const { homeTeam, awayTeam, utcDate } = nextMatch;

  return (
    <div className={styles.card}>
      <h2>Next UCL Match</h2>
      <div className={styles.teams}>
        <div className={styles.team}>
          <img src={homeTeam.crest} alt={homeTeam.name} />
          <p>{homeTeam.name}</p>
        </div>
        <p className={styles.vs}>vs</p>
        <div className={styles.team}>
          <img src={awayTeam.crest} alt={awayTeam.name} />
          <p>{awayTeam.name}</p>
        </div>
      </div>
      <p className={styles.date}>
        {new Date(utcDate).toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })}
      </p>
    </div>
  );
}
