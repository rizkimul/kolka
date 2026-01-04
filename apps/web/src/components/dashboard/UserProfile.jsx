import React from 'react';
import styles from './UserProfile.module.css';
import { Settings, Bell } from 'lucide-react';
import { Button } from '../common';

const UserProfile = ({ user, onLogout }) => {
  return (
    <header className={styles.header}>
      <div className={styles.userInfo}>
        <div className={styles.avatar}>{user?.avatar || '👤'}</div>
        <div className={styles.greeting}>
          <span className={styles.label}>Halo,</span>
          <h2 className={styles.username}>{user?.username || 'Teman'}!</h2>
        </div>
      </div>
      
      <div className={styles.actions}>
        <button className={styles.iconButton} aria-label="Notifikasi">
          <Bell size={24} color="var(--color-primary)" />
        </button>
        <button className={styles.iconButton} onClick={onLogout} aria-label="Pengaturan">
          <Settings size={24} color="var(--color-primary)" />
        </button>
      </div>
    </header>
  );
};

export default UserProfile;
