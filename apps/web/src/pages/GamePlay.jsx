import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndContext, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { useGame } from '../context/GameContext';
import { Button, ProgressBar, Modal } from '../components/common';
import QuestionCard from '../components/game/QuestionCard';
import DraggableWord from '../components/game/DraggableWord';
import { ArrowLeft, RefreshCcw } from 'lucide-react';
import styles from './GamePlay.module.css';
import confetti from 'canvas-confetti';
import { playSuccessSound, playErrorSound, playPopSound } from '../utils/soundEffects'; 
import { useTTS } from '../hooks/useTTS';

const GamePlay = () => {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { state, startLevel, submitAnswer, nextQuestion, resetStatus } = useGame();
  
  const [draggedAnswer, setDraggedAnswer] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const { speak } = useTTS();

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  useEffect(() => {
    if (levelId) {
      startLevel(levelId);
    }
  }, [levelId]);

  useEffect(() => {
    if (state.status === 'finished') {
      setShowResultModal(true);
      playSuccessSound();
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
      speak('Luar biasa! Kamu menyelesaikan semua soal!');
    }
  }, [state.status]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (over && over.id === 'answer-zone') {
      const answerText = active.data.current.text;
      setDraggedAnswer(answerText);
      playPopSound(); // Interaction sound
      
      const isCorrect = submitAnswer(answerText);
      
      if (isCorrect) {
        playSuccessSound();
        speak('Hebat! Jawabanmu benar.');
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        playErrorSound();
        speak('Coba lagi ya.');
        // Reset after short delay if wrong
        setTimeout(() => {
          setDraggedAnswer(null);
          resetStatus();
        }, 1000);
      }
    }
  };

  const handleNext = () => {
    setDraggedAnswer(null);
    resetStatus();
    nextQuestion();
  };

  const currentQuestion = state.questions[state.currentIndex];
  const progress = ((state.currentIndex) / state.questions.length) * 100;

  if (!currentQuestion) return <div>Loading...</div>;

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className={styles.container}>
        <header className={styles.header}>
          <Button 
            variant="text" 
            icon={<ArrowLeft size={24} />} 
            onClick={() => navigate('/level-selection')}
          >
            Keluar
          </Button>
          <div className={styles.progressBox}>
            <span className={styles.progressText}>
              Soal {state.currentIndex + 1}/{state.questions.length}
            </span>
            <ProgressBar progress={progress} size="small" className={styles.progressBar} />
          </div>
          <div className={styles.score}>
            ⭐ {state.score}
          </div>
        </header>

        <main className={styles.playArea}>
          <QuestionCard 
            question={currentQuestion}
            filledAnswer={draggedAnswer} 
            isCorrect={state.status === 'success'}
            isWrong={state.status === 'error'}
          />

          {state.status === 'success' ? (
            <div className={styles.feedbackArea}>
              <h2 className={styles.successText}>🎉 Benar! Hebat!</h2>
              <Button size="large" onClick={handleNext} className={styles.nextButton}>
                Lanjut ➡️
              </Button>
            </div>
          ) : (
            <div className={styles.optionsGrid}>
              {currentQuestion.options.map((opt) => (
                <DraggableWord 
                  key={opt.id} 
                  id={opt.id} 
                  text={opt.text} 
                  image={opt.image} 
                  type={opt.type} 
                />
              ))}
            </div>
          )}
        </main>

        {/* Level Complete Modal */}
        <Modal 
          isOpen={showResultModal} 
          onClose={() => navigate('/level-selection')}
          title="🏆 Level Selesai!"
          showCloseButton={false}
          footer={
            <div className={styles.modalFooter}>
              <Button variant="outline" onClick={() => navigate('/level-selection')}>
                Menu Utama
              </Button>
              <Button onClick={() => window.location.reload()}>
                Main Lagi 🔄
              </Button>
            </div>
          }
        >
          <div className={styles.resultContent}>
            <div className={styles.bigW}>⭐ ⭐ ⭐</div>
            <p className={styles.scoreText}>Total Skor: {state.score}</p>
            <div className={styles.statsGrid}>
              <div className={styles.statBox}>
                <span>✅ Benar</span>
                <strong>{state.correctCount}</strong>
              </div>
              <div className={styles.statBox}>
                <span>❌ Salah</span>
                <strong>{state.wrongCount}</strong>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </DndContext>
  );
};

export default GamePlay;
