import styles from './page.module.css';
import Link from 'next/link';

export default function Home() {
    
  // Example dummy matches
  const matches = [
    { id: '123', home: 'Team A', away: 'Team B' },
    { id: '456', home: 'Team C', away: 'Team D' },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Football Matches</h1>
      <ul className={styles.matchList}>
        {matches.map(match => (
          <li key={match.id} className={styles.matchItem}>
            <Link href={`/match/${match.id}`}>
              {match.home} vs {match.away}
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/browse" className={styles.browseLink}><p>Return to Matches</p></Link>
    </div>
  );
}
