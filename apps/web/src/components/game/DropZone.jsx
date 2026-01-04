import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import styles from './DropZone.module.css';
import clsx from 'clsx';

const DropZone = ({ filled, content, isCorrect, isWrong }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'answer-zone',
    disabled: filled
  });

  return (
    <div 
      ref={setNodeRef} 
      className={clsx(
        styles.zone,
        isOver && styles.highlight,
        filled && styles.filled,
        filled && isCorrect && styles.correct,
        filled && isWrong && styles.wrong
      )}
    >
      {filled ? (
        <span className={styles.content}>{content}</span>
      ) : (
        <span className={styles.placeholder}>Geser sini</span>
      )}
    </div>
  );
};

export default DropZone;
