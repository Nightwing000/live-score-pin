import styles from './MatchCard.module.css';

export default function MatchCard({ match }) {
    
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
        <p className={styles.score}>
            Score: {match.score.fullTime.home} - {match.score.fullTime.away}
        </p>
        <p className={styles.date}>
            Date: {new Date(match.utcDate).toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })}
        </p>
        <p className={styles.status}>Status: {match.status}</p>
        
        </div>
    );

}