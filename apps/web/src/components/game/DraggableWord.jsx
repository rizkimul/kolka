import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import styles from './DraggableWord.module.css';
import { Card } from '../common';
import { Volume2 } from 'lucide-react';
import { useTTS } from '../../hooks/useTTS';

const DraggableWord = ({ id, text, image, type }) => {
  const { speak } = useTTS();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
    data: { text, type }
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0 : 1, // Hide original when dragging
    touchAction: 'none',
  };

  const handleSpeak = (e) => {
    e.stopPropagation(); // Prevent drag start when clicking speaker
    speak(text);
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <Card className={styles.card} hoverable>
        {/* Speaker Button */}
        <button 
          className={styles.speakerBtn} 
          onPointerDown={handleSpeak} // Using PointerDown to capture before drag logic
          aria-label={`Dengarkan kata ${text}`}
        >
          <Volume2 size={14} color="var(--color-primary)" />
        </button>

        <div className={styles.image}>{image}</div>
        <div className={styles.text}>{text}</div>
      </Card>
    </div>
  );
};

export default DraggableWord;
