import React from 'react';
import styles from './ProgressBar.module.css';
import clsx from 'clsx';

const ProgressBar = ({ 
  progress = 0, // 0 to 100
  size = 'medium',
  className 
}) => {
  // Clamp value between 0 and 100
  const width = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={clsx(styles.container, styles[size], className)}>
      <div 
        className={styles.bar} 
        style={{ width: `${width}%` }}
        role="progressbar"
        aria-valuenow={width}
        aria-valuemin="0"
        aria-valuemax="100"
      />
    </div>
  );
};

export default ProgressBar;
