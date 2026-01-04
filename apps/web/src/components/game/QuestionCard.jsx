import React from 'react';
import styles from './QuestionCard.module.css';
import DropZone from './DropZone';
import { Volume2 } from 'lucide-react';
import { useTTS } from '../../hooks/useTTS';

const QuestionCard = ({ question, filledAnswer, isCorrect, isWrong }) => {
  const { speak } = useTTS();
  
  if (!question) return null;

  // Split sentence by '_____' to insert DropZone
  const parts = question.sentence.split('_____');
  
  // Create full sentence for TTS (replace blank with "titik-titik-titik" or the filled answer)
  const getSentenceForSpeech = () => {
    if (filledAnswer) {
      return question.sentence.replace('_____', filledAnswer);
    }
    return question.sentence.replace('_____', 'titik titik titik');
  };

  const handleReadSentence = () => {
    speak(getSentenceForSpeech());
  };

  return (
    <div className={styles.container}>
      <div className={styles.contextImage}>{question.contextImage}</div>
      
      <div className={styles.sentenceBox}>
        <button 
          className={styles.sentenceSpeaker}
          onClick={handleReadSentence}
          aria-label="Dengarkan kalimat"
        >
          <Volume2 size={20} color="var(--color-primary)" />
        </button>
        
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
