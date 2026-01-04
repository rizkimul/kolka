import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserProfile, StatsCard } from '../components/dashboard';
import { Button, Card, Modal } from '../components/common';
import { useNavigate } from 'react-router-dom';
import { Play, BookOpen, Award } from 'lucide-react';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { user, progress, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Calculate XP progress to next level
  const totalXp = progress?.totalXp || 0;
  const currentLevelXp = totalXp % 100; // XP within current level
  const maxExp = 100; // XP needed per level

  return (
    <div className={styles.container}>
      <UserProfile 
        user={{
          ...user,
          avatar: user?.image || '🦁',
          username: user?.name || 'Pemain',
        }} 
        onLogout={() => setShowLogoutConfirm(true)} 
      />
      
      <StatsCard 
        level={progress?.currentLevel || 1} 
        score={progress?.totalScore || 0}
        stars={progress?.totalStars || 0}
        currentExp={currentLevelXp} 
        maxExp={maxExp} 
      />

      <section className={styles.mainAction}>
        <div className={styles.decorCircle} />
        <Card className={styles.playCard}>
          <div className={styles.playContent}>
            <h3>Siap Belajar?</h3>
            <p>Ayo selesaikan misi barumu hari ini!</p>
            <Button 
              size="large" 
              block 
              icon={<Play fill="currentColor" />}
              onClick={() => navigate('/level-selection')}
              className={styles.playButton}
            >
              MULAI MAIN
            </Button>
          </div>
          <div className={styles.illustration}>🚀</div>
        </Card>
      </section>

      <section className={styles.menuGrid}>
        <button className={styles.menuItem} onClick={() => navigate('/guide')}>
          <div className={styles.menuIcon + ' ' + styles.blue}>
            <BookOpen size={24} color="white" />
          </div>
          <span>Panduan</span>
        </button>

        <button className={styles.menuItem} onClick={() => navigate('/leaderboard')}>
          <div className={styles.menuIcon + ' ' + styles.yellow}>
            <Award size={24} color="white" />
          </div>
          <span>Peringkat</span>
        </button>
      </section>

      {/* Logout Confirmation Modal */}
      <Modal 
        isOpen={showLogoutConfirm} 
        onClose={() => setShowLogoutConfirm(false)}
        title="Yakin mau keluar?"
        footer={
          <div className={styles.modalFooter}>
            <Button variant="outline" onClick={() => setShowLogoutConfirm(false)}>Batal</Button>
            <Button variant="primary" onClick={handleLogout} className={styles.logoutBtn}>Ya, Keluar</Button>
          </div>
        }
      >
        <p>Kamu harus login lagi nanti untuk melanjutkan permainan.</p>
      </Modal>
    </div>
  );
};

export default Dashboard;
