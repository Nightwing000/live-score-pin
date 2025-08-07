// src/app/search/page.js
'use client';
import { useEffect, useState } from 'react';
import SearchBar from '../components/searchbar';
import MatchCard from '../components/Matchcard';
import styles from './Search.module.css';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    console.log('Fetching matches...');
    fetch('/api/all-matches')
      .then(res => {
        console.log('API response status:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('API response data:', data);
        console.log('Number of matches:', data.matches?.length || 0);
        setMatches(data.matches || []);
      })
      .catch(error => {
        console.error('Error fetching matches:', error);
      });
  }, []);

  const filtered = matches.filter(
    (m) =>
      m.status === 'SCHEDULED' &&
      (m.homeTeam.name.toLowerCase().includes(query.toLowerCase()) ||
        m.awayTeam.name.toLowerCase().includes(query.toLowerCase()))
  );

  console.log('Total matches:', matches.length);
  console.log('Scheduled matches:', matches.filter(m => m.status === 'SCHEDULED').length);
  console.log('Search query:', query);
  console.log('Filtered results:', filtered.length);

  return (
    <div className={styles.searchPage}>
      {/* Debug info */}
      <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0' }}>
        <h3>Debug Info:</h3>
        <p>Total matches loaded: {matches.length}</p>
        <p>Scheduled matches: {matches.filter(m => m.status === 'SCHEDULED').length}</p>
        <p>Search query: "{query}"</p>
        <p>Filtered results: {filtered.length}</p>
      </div>

      <div className={styles.searchContainer}>
        <SearchBar query={query} setQuery={setQuery} />
        {query && (
          <button 
            className={styles.clearButton}
            onClick={() => setQuery('')}
          >
            ×
          </button>
        )}
      </div>
      
      {query && (
        <p className={styles.resultsInfo}>
          Found {filtered.length} matches for "{query}"
        </p>
      )}
      
      <div className={styles.matchList}>
        {filtered.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
}
