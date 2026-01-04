import React from 'react';
import styles from './AvatarPicker.module.css';
import { Card } from '../common';
import clsx from 'clsx';

const AVATARS = [
  '🦁', '🐯', '🐼', '🐨', '🐸', 
  '🦊', '🐱', '🐶', '🦄', '🐲',
  '🚀', '⭐', '🤖', '👾', '🤡'
];

const AvatarPicker = ({ selected, onSelect }) => {
  return (
    <div className={styles.grid}>
      {AVATARS.map((avatar) => (
        <button
          key={avatar}
          type="button"
          className={clsx(
            styles.option,
            selected === avatar && styles.selected
          )}
          onClick={() => onSelect(avatar)}
          aria-label={`Pilih avatar ${avatar}`}
          aria-pressed={selected === avatar}
        >
          <span className={styles.emoji}>{avatar}</span>
          {selected === avatar && (
            <div className={styles.checkmark}>✓</div>
          )}
        </button>
      ))}
    </div>
  );
};

export default AvatarPicker;
