// src/app/search/page.js
'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchBar from '../components/searchbar';
import MatchCard from '../components/Matchcard';
import styles from './Search.module.css';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [matches, setMatches] = useState([]);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get query from URL parameters
    const urlQuery = searchParams.get('query');
    if (urlQuery) {
      setQuery(urlQuery);
    }
  }, [searchParams]);

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
        
        // Count matches by league
        const leagueCounts = {};
        data.matches?.forEach(match => {
          const league = match.league || 'Unknown';
          leagueCounts[league] = (leagueCounts[league] || 0) + 1;
        });
        console.log('Matches by league:', leagueCounts);
        
        // Show some sample matches
        console.log('First 3 matches:', data.matches?.slice(0, 3));
        
        setMatches(data.matches || []);
      })
      .catch(error => {
        console.error('Error fetching matches:', error);
      });
  }, []);

  const filtered = matches.filter(
    (m) => {
      // Check if match has valid team names
      if (!m.homeTeam?.name || !m.awayTeam?.name) return false;
      
      // Check if team name matches search query
      const matchesQuery = m.homeTeam.name.toLowerCase().includes(query.toLowerCase()) ||
                          m.awayTeam.name.toLowerCase().includes(query.toLowerCase());
      if (!matchesQuery) return false;
      
      // Show upcoming matches (TIMED, SCHEDULED)
      if (m.status === 'TIMED' || m.status === 'SCHEDULED') return true;
      
      // Show recent finished matches (last 7 days only)
      if (m.status === 'FINISHED') {
        const matchDate = new Date(m.utcDate);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return matchDate >= oneWeekAgo;
      }
      
      return false;
    }
  );

  console.log('Total matches:', matches.length);
  console.log('Scheduled matches:', matches.filter(m => m.status === 'SCHEDULED').length);
  console.log('Search query:', query);
  console.log('Filtered results:', filtered.length);
  
  // Debug: Show leagues in filtered results
  if (query && filtered.length > 0) {
    const filteredLeagues = {};
    filtered.forEach(match => {
      const league = match.league || 'No League';
      filteredLeagues[league] = (filteredLeagues[league] || 0) + 1;
    });
    console.log('Filtered results by league:', filteredLeagues);
    
    // Show first few matches with their leagues
    console.log('Sample filtered matches:', filtered.slice(0, 3).map(m => ({
      home: m.homeTeam?.name,
      away: m.awayTeam?.name,
      league: m.league,
      status: m.status
    })));
  }

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
