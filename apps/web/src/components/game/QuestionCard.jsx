import React from 'react';
import styles from './QuestionCard.module.css';
import DropZone from './DropZone';

const QuestionCard = ({ question, filledAnswer, isCorrect, isWrong }) => {
  if (!question) return null;

  // Split sentence by '_____' to insert DropZone
  const parts = question.sentence.split('_____');

  return (
    <div className={styles.container}>
      <div className={styles.contextImage}>{question.contextImage}</div>
      
      <div className={styles.sentenceBox}>
        {parts[0]}
        <DropZone 
          filled={!!filledAnswer}
          content={filledAnswer}
          isCorrect={isCorrect}
          isWrong={isWrong}
        />
        {parts[1]}
      </div>
    </div>
  );
};

export default QuestionCard;
