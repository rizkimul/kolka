import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserProfile, StatsCard } from '../components/dashboard';
import { Button, Card, Modal } from '../components/common';
import { useNavigate } from 'react-router-dom';
import { Play, BookOpen, Award, LogOut } from 'lucide-react';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <UserProfile user={user} onLogout={() => setShowLogoutConfirm(true)} />
      
      <StatsCard 
        level={user?.level} 
        score={user?.score} 
        currentExp={45} 
        maxExp={100} 
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

        <button className={styles.menuItem} onClick={() => alert('Leaderboard coming soon!')}>
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
