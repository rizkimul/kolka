import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, DragOverlay, useSensor, useSensors, MouseSensor, TouchSensor, useDroppable, useDraggable } from '@dnd-kit/core';
import { ArrowLeft, Trophy, RotateCcw, CheckCircle, XCircle, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useTTS } from '../hooks/useTTS';
import { playSuccessSound, playErrorSound, playPopSound } from '../utils/soundEffects';

const questions = [
  {
    id: 1,
    pattern: 'S-P',
    words: ['bermain', 'Adik'],
    correct: ['Adik', 'bermain'],
    hint: [
      { text: 'Adik', type: 'S' },
      { text: 'bermain', type: 'P' },
    ],
  },
  {
    id: 2,
    pattern: 'S-P-O',
    words: ['membaca', 'buku', 'Kakak'],
    correct: ['Kakak', 'membaca', 'buku'],
    hint: [
      { text: 'Kakak', type: 'S' },
      { text: 'membaca', type: 'P' },
      { text: 'buku', type: 'O' },
    ],
  },
  {
    id: 3,
    pattern: 'S-P-O-K',
    words: ['Ibu', 'di dapur', 'memasak', 'sayur'],
    correct: ['Ibu', 'memasak', 'sayur', 'di dapur'],
    hint: [
      { text: 'Ibu', type: 'S' },
      { text: 'memasak', type: 'P' },
      { text: 'sayur', type: 'O' },
      { text: 'di dapur', type: 'K' },
    ],
  },
  {
    id: 4,
    pattern: 'S-P-O-K',
    words: ['koran', 'setiap pagi', 'Ayah', 'membaca'],
    correct: ['Ayah', 'membaca', 'koran', 'setiap pagi'],
    hint: [
      { text: 'Ayah', type: 'S' },
      { text: 'membaca', type: 'P' },
      { text: 'koran', type: 'O' },
      { text: 'setiap pagi', type: 'K' },
    ],
  },
];

const typeColors = {
  S: 'bg-red-500',
  P: 'bg-yellow-500',
  O: 'bg-blue-500',
  K: 'bg-green-500',
};

// Draggable Word Component
const DraggableWord = ({ id, word, isDisabled, isInArrangement }) => {
  const { speak } = useTTS();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { word, isInArrangement },
    disabled: isDisabled,
  });

  const handleSpeak = (e) => {
    e.stopPropagation();
    e.preventDefault();
    speak(word);
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        touchAction: 'none',
      }}
      className={`relative px-4 py-2 rounded-lg font-semibold shadow-md transition-colors
        ${isDragging ? 'opacity-30 z-50' : 'opacity-100'}
        ${isInArrangement 
          ? 'bg-purple-500 text-white hover:bg-purple-600 cursor-grab active:cursor-grabbing' 
          : 'bg-white border-2 border-gray-300 text-gray-800 hover:border-purple-400 hover:bg-purple-50 cursor-grab active:cursor-grabbing'
        }
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {word}
      <button
        onPointerDown={handleSpeak}
        className={`absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center shadow ${
          isInArrangement ? 'bg-white' : 'bg-purple-100'
        }`}
      >
        <Volume2 size={10} className="text-purple-600" />
      </button>
    </div>
  );
};

// Drop Zone for Arrangement
const ArrangementDropZone = ({ children, isEmpty }) => {
  const { isOver, setNodeRef } = useDroppable({ id: 'arrangement-zone' });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[100px] rounded-xl p-4 border-2 border-dashed transition-colors ${
        isOver 
          ? 'bg-purple-100 border-purple-500' 
          : 'bg-purple-50 border-purple-300'
      }`}
    >
      {isEmpty ? (
        <p className="text-center text-gray-400 py-6">Seret kata ke sini untuk menyusun kalimat</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {children}
        </div>
      )}
    </div>
  );
};

// Drop Zone for Available Words (to return words)
const AvailableDropZone = ({ children }) => {
  const { isOver, setNodeRef } = useDroppable({ id: 'available-zone' });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[60px] rounded-xl p-4 transition-colors ${
        isOver 
          ? 'bg-gray-100 ring-2 ring-gray-400' 
          : ''
      }`}
    >
      <div className="flex flex-wrap gap-2">
        {children}
      </div>
    </div>
  );
};

const MenyusunKalimat = () => {
  const navigate = useNavigate();
  const { speak } = useTTS();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [availableWords, setAvailableWords] = useState([]);
  const [arrangedWords, setArrangedWords] = useState([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 8 } })
  );

  const currentQuestion = questions[currentIndex];
  const isCorrect = JSON.stringify(arrangedWords) === JSON.stringify(currentQuestion.correct);

  useEffect(() => {
    // Shuffle words when question changes
    setAvailableWords([...currentQuestion.words].sort(() => Math.random() - 0.5));
    setArrangedWords([]);
    setIsAnswered(false);
  }, [currentIndex]);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    playPopSound();
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || isAnswered) return;

    const draggedWord = active.data.current.word;
    const isFromArrangement = active.data.current.isInArrangement;

    if (over.id === 'arrangement-zone' && !isFromArrangement) {
      // Move from available to arrangement
      setAvailableWords(prev => prev.filter(w => w !== draggedWord));
      setArrangedWords(prev => [...prev, draggedWord]);
      playPopSound();
    } else if (over.id === 'available-zone' && isFromArrangement) {
      // Move from arrangement back to available
      setArrangedWords(prev => prev.filter(w => w !== draggedWord));
      setAvailableWords(prev => [...prev, draggedWord]);
      playPopSound();
    }
  };

  const handleReset = () => {
    setAvailableWords([...currentQuestion.words].sort(() => Math.random() - 0.5));
    setArrangedWords([]);
    setIsAnswered(false);
  };

  const handleSubmit = () => {
    if (arrangedWords.length !== currentQuestion.correct.length) return;
    
    setIsAnswered(true);
    const correct = JSON.stringify(arrangedWords) === JSON.stringify(currentQuestion.correct);
    
    if (correct) {
      setScore(score + 15);
      setCorrectCount(correctCount + 1);
      playSuccessSound();
      speak('Benar! Hebat!');
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    } else {
      playErrorSound();
      speak('Coba lagi ya.');
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleResetAll = () => {
    setCurrentIndex(0);
    setScore(0);
    setCorrectCount(0);
  };

  const isFinished = currentIndex === questions.length - 1 && isAnswered;

  const getActiveWord = () => {
    if (!activeId) return null;
    // ID format: "available-{word}" or "arranged-{word}"
    const availableWord = availableWords.find((word) => `available-${word}` === activeId);
    if (availableWord) return availableWord;
    const arrangedWord = arrangedWords.find((word) => `arranged-${word}` === activeId);
    return arrangedWord;
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
        {/* Header */}
        <div className="bg-white shadow-md sticky top-0 z-10">
          <div className="max-w-md mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/bermain')}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Menyusun Kalimat</h1>
                  <p className="text-xs text-gray-600">Soal {currentIndex + 1} dari {questions.length}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">{score}</div>
                <div className="text-xs text-gray-600">Poin</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-md mx-auto px-6 py-8">
          {!isFinished ? (
            <div className="space-y-6">
              {/* Pattern Badge */}
              <div className="flex justify-center">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-full text-white font-semibold">
                  Pola: {currentQuestion.pattern}
                </div>
              </div>

              {/* Instruction */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-center gap-3">
                  <p className="text-center text-gray-700 font-semibold">
                    Seret kata-kata berikut untuk menyusun kalimat yang benar!
                  </p>
                  <button
                    onClick={() => speak('Seret kata-kata berikut untuk menyusun kalimat yang benar')}
                    className="p-2 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors flex-shrink-0"
                  >
                    <Volume2 size={18} className="text-purple-600" />
                  </button>
                </div>
              </div>

              {/* Arranged Words Area */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-700">Susunan Kalimat:</p>
                  <button
                    onClick={handleReset}
                    disabled={isAnswered}
                    className="flex items-center gap-1 text-purple-600 text-sm font-medium hover:text-purple-700 disabled:opacity-50"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                </div>
                <ArrangementDropZone isEmpty={arrangedWords.length === 0}>
                  {arrangedWords.map((word, index) => (
                    <DraggableWord
                      key={`arranged-${word}-${index}`}
                      id={`arranged-${word}`}
                      word={word}
                      isDisabled={isAnswered}
                      isInArrangement={true}
                    />
                  ))}
                </ArrangementDropZone>
              </div>

              {/* Available Words */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <p className="text-sm font-semibold text-gray-700 mb-3">Kata-kata yang tersedia:</p>
                <AvailableDropZone>
                  {availableWords.length === 0 ? (
                    <p className="text-gray-400 text-sm">Semua kata sudah disusun</p>
                  ) : (
                    availableWords.map((word, index) => (
                      <DraggableWord
                        key={`available-${word}-${index}`}
                        id={`available-${word}`}
                        word={word}
                        isDisabled={isAnswered}
                        isInArrangement={false}
                      />
                    ))
                  )}
                </AvailableDropZone>
              </div>

              {/* Hint */}
              {!isAnswered && (
                <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                  <p className="text-sm font-semibold text-blue-700 mb-2">💡 Petunjuk SPOK:</p>
                  <div className="flex flex-wrap gap-2">
                    {currentQuestion.hint.map((item, index) => (
                      <span
                        key={index}
                        className={`${typeColors[item.type]} text-white px-3 py-1 rounded-lg text-sm font-semibold`}
                      >
                        {item.type}: {item.text}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback */}
              <AnimatePresence>
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className={`rounded-xl p-4 ${
                      isCorrect ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <p className={`font-semibold mb-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                          {isCorrect ? 'Benar! 🎉' : 'Kurang Tepat'}
                        </p>
                        {!isCorrect && (
                          <div>
                            <p className="text-sm text-gray-700 mb-2">Susunan yang benar:</p>
                            <p className="font-semibold text-gray-800">{currentQuestion.correct.join(' ')}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {!isAnswered ? (
                  <button
                    onClick={handleSubmit}
                    disabled={arrangedWords.length !== currentQuestion.correct.length}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 text-lg rounded-xl transition-all disabled:opacity-50"
                  >
                    Jawab
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 text-lg rounded-xl transition-all"
                  >
                    {currentIndex < questions.length - 1 ? 'Soal Selanjutnya' : 'Lihat Hasil'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Results Screen */
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Selesai!</h2>
                <p className="text-gray-600 mb-6">Kamu telah menyelesaikan semua soal</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-purple-50 rounded-xl p-4">
                    <div className="text-3xl font-bold text-purple-600">{score}</div>
                    <div className="text-sm text-gray-600">Total Poin</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="text-3xl font-bold text-green-600">{correctCount}/{questions.length}</div>
                    <div className="text-sm text-gray-600">Benar</div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleResetAll}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 rounded-xl transition-all"
                  >
                    Ulangi Latihan
                  </button>
                  <button
                    onClick={() => navigate('/bermain')}
                    className="w-full border-2 border-gray-200 text-gray-700 font-semibold py-4 rounded-xl hover:bg-gray-50 transition-all"
                  >
                    Kembali ke Menu
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeId && getActiveWord() && (
            <div className="bg-purple-500 text-white px-4 py-2 rounded-xl font-semibold shadow-lg">
              {getActiveWord()}
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

export default MenyusunKalimat;
