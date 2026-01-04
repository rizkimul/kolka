import React from 'react';
import styles from './StatsCard.module.css';
import { Card, ProgressBar } from '../common';
import { Trophy, Star } from 'lucide-react';
import clsx from 'clsx';

const StatsCard = ({ level = 1, currentExp = 0, maxExp = 100, score = 0, stars = 0 }) => {
  const progress = (currentExp / maxExp) * 100;

  return (
    <Card className={styles.container}>
      <div className={styles.topRow}>
        <div className={styles.statItem}>
          <div className={clsx(styles.iconBg, styles.blue)}>
            <Trophy size={20} color="white" />
          </div>
          <div>
            <span className={styles.label}>Level</span>
            <span className={styles.value}>{level}</span>
          </div>
        </div>
        
        <div className={styles.statItem}>
          <div className={clsx(styles.iconBg, styles.yellow)}>
            <Star size={20} color="white" />
          </div>
          <div>
            <span className={styles.label}>Skor</span>
            <span className={styles.value}>{score}</span>
          </div>
        </div>
      </div>

      <div className={styles.progressContainer}>
        <div className={styles.progressLabel}>
          <small>{currentExp}/{maxExp} XP</small>
          <small>Menuju Level {level + 1}</small>
        </div>
        <ProgressBar progress={progress} />
      </div>
    </Card>
  );
};

export default StatsCard;
