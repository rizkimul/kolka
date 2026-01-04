import React from 'react';
import styles from './LevelCard.module.css';
import { Card } from '../common';
import { Star, Lock } from 'lucide-react';
import clsx from 'clsx';

const LevelCard = ({ 
  title, 
  subtitle, 
  example, 
  variant = 'subject', // subject, predicate, object, adverb
  stars = 0, 
  locked = false,
  onClick 
}) => {
  return (
    <Card 
      variant={locked ? 'default' : variant} 
      className={clsx(styles.card, locked && styles.locked)}
      onClick={!locked ? onClick : undefined}
      hoverable={!locked}
    >
      <div className={styles.header}>
        <div className={clsx(styles.iconBox, styles[variant])}>
          {variant === 'subject' && '👤'}
          {variant === 'predicate' && '🏃'}
          {variant === 'object' && '📦'}
          {variant === 'adverb' && '📍'}
        </div>
        
        {locked ? (
          <Lock className={styles.lockIcon} size={24} />
        ) : (
          <div className={styles.stars}>
            {[1, 2, 3].map((i) => (
              <Star 
                key={i} 
                size={16} 
                fill={i <= stars ? "#F39C12" : "none"} 
                color={i <= stars ? "#F39C12" : "#CBD5E1"} 
              />
            ))}
          </div>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.subtitle}>{subtitle}</p>
        <div className={styles.example}>
          <small>Contoh: </small>
          <span>{example}</span>
        </div>
      </div>
    </Card>
  );
};

export default LevelCard;
