import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button, Card } from '../components/common';
import { ArrowLeft, Trophy, Medal, Crown, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { leaderboardApi } from '../services/api';
import styles from './Leaderboard.module.css';

const Leaderboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('global'); // 'global' or 'weekly'

  useEffect(() => {
    fetchLeaderboard();
  }, [activeTab]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      
      const data = activeTab === 'global' 
        ? await leaderboardApi.getGlobal(20)
        : await leaderboardApi.getWeekly(20);
      
      setLeaderboard(data);

      // Fetch user's rank
      try {
        const rank = await leaderboardApi.getMyRank();
        setMyRank(rank);
      } catch (e) {
        // User might not have any progress yet
        setMyRank(null);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown size={24} color="#FFD700" />;
      case 2:
        return <Medal size={24} color="#C0C0C0" />;
      case 3:
        return <Medal size={24} color="#CD7F32" />;
      default:
        return <span className={styles.rankNumber}>{rank}</span>;
    }
  };

  const getRankClass = (rank) => {
    switch (rank) {
      case 1:
        return styles.gold;
      case 2:
        return styles.silver;
      case 3:
        return styles.bronze;
      default:
        return '';
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Button 
          variant="text" 
          icon={<ArrowLeft size={24} />} 
          onClick={() => navigate('/dashboard')}
        >
          Kembali
        </Button>
        <h1 className={styles.title}>
          <Trophy size={28} /> Peringkat
        </h1>
      </header>

      {/* Tab Switcher */}
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'global' ? styles.active : ''}`}
          onClick={() => setActiveTab('global')}
        >
          Semua Waktu
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'weekly' ? styles.active : ''}`}
          onClick={() => setActiveTab('weekly')}
        >
          Minggu Ini
        </button>
      </div>

      {/* User's Rank */}
      {myRank && myRank.rank > 0 && (
        <Card className={styles.myRankCard}>
          <div className={styles.myRankContent}>
            <span className={styles.myRankLabel}>Peringkatmu</span>
            <span className={styles.myRankNumber}>#{myRank.rank}</span>
            <span className={styles.myRankTotal}>dari {myRank.totalPlayers} pemain</span>
          </div>
        </Card>
      )}

      {/* Leaderboard List */}
      <div className={styles.list}>
        {loading ? (
          <div className={styles.loadingContainer}>
            <Loader2 className={styles.spinner} size={48} />
            <p>Memuat peringkat...</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className={styles.emptyState}>
            <p>🏆 Belum ada data peringkat.</p>
            <p>Jadilah yang pertama!</p>
          </div>
        ) : (
          leaderboard.map((entry) => (
            <Card 
              key={entry.userId} 
              className={`${styles.rankCard} ${getRankClass(entry.rank)} ${entry.userId === user?.id ? styles.isMe : ''}`}
            >
              <div className={styles.rankIcon}>
                {getRankIcon(entry.rank)}
              </div>
              <div className={styles.avatar}>
                {entry.image || '🦁'}
              </div>
              <div className={styles.info}>
                <span className={styles.name}>
                  {entry.name}
                  {entry.userId === user?.id && <span className={styles.youBadge}>Kamu</span>}
                </span>
                <span className={styles.stats}>
                  Level {entry.currentLevel} • ⭐ {entry.totalStars}
                </span>
              </div>
              <div className={styles.score}>
                {entry.totalScore.toLocaleString()}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
