import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndContext, DragOverlay, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { Button, ProgressBar, Modal, Card } from '../components/common';
import QuestionCard from '../components/game/QuestionCard';
import DraggableWord from '../components/game/DraggableWord';
import { ArrowLeft, RefreshCcw, Loader2, Volume2 } from 'lucide-react';
import styles from './GamePlay.module.css';
import confetti from 'canvas-confetti';
import { playSuccessSound, playErrorSound, playPopSound } from '../utils/soundEffects'; 
import { useTTS } from '../hooks/useTTS';

const GamePlay = () => {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { state, startLevel, submitAnswer, nextQuestion, resetStatus, submitLevelCompletion, resetGame } = useGame();
  const { refreshProgress } = useAuth();
  
  const [draggedAnswer, setDraggedAnswer] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [completionResult, setCompletionResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeId, setActiveId] = useState(null); // Track which item is being dragged
  const { speak } = useTTS();

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  // Reset local state when levelId changes (fix for level completion bug)
  useEffect(() => {
    setDraggedAnswer(null);
    setShowResultModal(false);
    setCompletionResult(null);
    setSubmitting(false);
    setActiveId(null);
  }, [levelId]);

  // Load level questions from API
  useEffect(() => {
    if (levelId) {
      // Start level
      startLevel(levelId).catch((err) => {
        console.error('Failed to start level:', err);
        // Navigate back if level fails to load
        navigate('/level-selection');
      });
    }

    // Cleanup: Reset game state when component unmounts or level changes
    // This ensures we don't carry over state to other game instances
    return () => {
      resetGame();
    };
  }, [levelId, startLevel, navigate, resetGame]);

  // Handle level completion
  useEffect(() => {
    // Only trigger completion if status is finished AND the active level matches current URL
    // This prevents race condition where stale "finished" state from previous level triggers this
    if (state.status === 'finished' && !showResultModal && state.activeLevel === levelId) {
      handleLevelComplete();
    }
  }, [state.status, state.activeLevel, levelId, showResultModal]);

  const handleLevelComplete = async () => {
    setSubmitting(true);
    setShowResultModal(true);
    
    playSuccessSound();
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
    speak('Luar biasa! Kamu menyelesaikan semua soal!');

    try {
      // Submit completion to backend
      const result = await submitLevelCompletion();
      setCompletionResult(result);
      
      // Refresh user progress
      await refreshProgress();
    } catch (error) {
      console.error('Failed to submit completion:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null); // Clear active item
    
    if (over && over.id === 'answer-zone') {
      const answerText = active.data.current.text;
      setDraggedAnswer(answerText);
      playPopSound();
      
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
        setTimeout(() => {
          setDraggedAnswer(null);
          resetStatus();
        }, 1000);
      }
    }
  };

  // Get active option for DragOverlay
  const getActiveOption = () => {
    if (!activeId || !currentQuestion) return null;
    return currentQuestion.options?.find(opt => opt.id === activeId);
  };

  const handleNext = () => {
    setDraggedAnswer(null);
    resetStatus();
    nextQuestion();
  };

  const handlePlayAgain = () => {
    setShowResultModal(false);
    setCompletionResult(null);
    startLevel(levelId);
  };

  // Calculate stars display
  const getStarsDisplay = () => {
    if (completionResult?.stars !== undefined) {
      return '⭐'.repeat(completionResult.stars) + '☆'.repeat(3 - completionResult.stars);
    }
    // Fallback calculation
    const total = state.correctCount + state.wrongCount;
    if (total === 0) return '☆☆☆';
    const percentage = (state.correctCount / total) * 100;
    if (percentage === 100) return '⭐⭐⭐';
    if (percentage >= 70) return '⭐⭐☆';
    if (percentage >= 50) return '⭐☆☆';
    return '☆☆☆';
  };

  // Loading state
  if (state.status === 'loading') {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Loader2 className={styles.spinner} size={48} />
          <p>Memuat soal...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (state.error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <p>❌ {state.error}</p>
          <Button onClick={() => navigate('/level-selection')}>
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = state.questions[state.currentIndex];
  const progress = state.questions.length > 0 
    ? ((state.currentIndex) / state.questions.length) * 100 
    : 0;

  if (!currentQuestion) return <div>Loading...</div>;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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
              <Button onClick={handlePlayAgain} disabled={submitting}>
                Main Lagi 🔄
              </Button>
            </div>
          }
        >
          <div className={styles.resultContent}>
            <div className={styles.bigW}>{getStarsDisplay()}</div>
            <p className={styles.scoreText}>Total Skor: {state.score}</p>
            
            {completionResult && (
              <p className={styles.xpText}>+{completionResult.xpGained} XP</p>
            )}
            
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
            
            {submitting && (
              <p className={styles.savingText}>Menyimpan hasil...</p>
            )}
          </div>
        </Modal>

        {/* Drag Overlay - Shows the dragged card following cursor/finger */}
        <DragOverlay dropAnimation={null}>
          {activeId && getActiveOption() && (
            <div className={styles.dragOverlay}>
              <Card className={styles.dragCard}>
                <div className={styles.dragImage}>{getActiveOption().image}</div>
                <div className={styles.dragText}>{getActiveOption().text}</div>
              </Card>
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

export default GamePlay;
