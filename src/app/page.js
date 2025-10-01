'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [nextMatch, setNextMatch] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/ucl')
      .then((res) => res.json())
      .then((data) => {
        const upcoming = data.matches.find((match) => match.status !== 'FINISHED');
        setNextMatch(upcoming);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/search");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div>
      {/* Search box */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search for teams..."
          style={{ 
            padding: '10px', 
            borderRadius: '8px', 
            border: '1px solid #ccc',
            marginRight: '10px',
            width: '300px'
          }}
        />
        <button 
          onClick={handleSearch}
          style={{ 
            padding: '10px 15px', 
            borderRadius: '8px', 
            border: 'none',
            background: '#007bff',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          🔍
        </button>
      </div>

      {/* Match card - conditional */}
      {loading ? (
        <div className={styles.card}>
          <p>Loading next match...</p>
        </div>
      ) : nextMatch ? (
        <div className={styles.card}>
          <h2>Next UCL Match</h2>
          <div className={styles.teams}>
            <div className={styles.team}>
              <img src={nextMatch.homeTeam.crest} alt={nextMatch.homeTeam.name} />
              <p>{nextMatch.homeTeam.name}</p>
            </div>
            <p className={styles.vs}>vs</p>
            <div className={styles.team}>
              <img src={nextMatch.awayTeam.crest} alt={nextMatch.awayTeam.name} />
              <p>{nextMatch.awayTeam.name}</p>
            </div>
          </div>
          <p className={styles.date}>
            {new Date(nextMatch.utcDate).toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })}
          </p>
        </div>
      ) : (
        <div className={styles.card}>
          <h2>UCL Matches</h2>
          <p>No upcoming UCL matches available</p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            Use the search above to find matches from other leagues!
          </p>
        </div>
      )}
    </div>
  );
}
