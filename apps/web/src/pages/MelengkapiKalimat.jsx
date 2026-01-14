import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, DragOverlay, useSensor, useSensors, MouseSensor, TouchSensor, useDroppable, useDraggable } from '@dnd-kit/core';
import { ArrowLeft, Trophy, RotateCcw, CheckCircle, XCircle, Volume2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useTTS } from '../hooks/useTTS';
import { playSuccessSound, playErrorSound, playPopSound } from '../utils/soundEffects';

// Helper function to shuffle an array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Helper to standardize word display (capitalize first letter of subjects/names)
const standardizeWord = (word, isSubject = false) => {
  if (!word) return word;
  // If it's a subject (name/noun), capitalize first letter
  if (isSubject) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
  // For predicates, objects, keterangan - lowercase (unless proper noun)
  return word.toLowerCase();
};

// Question data from reference
const questions = [
  // Subjek (4 soal)
  { 
    id: 1, 
    type: 'S', 
    sentenceParts: [
      { text: '', type: 'S', isBlank: true },
      { text: 'membaca', type: 'P' },
      { text: 'buku', type: 'O' },
      { text: 'di perpustakaan', type: 'K' },
    ],
    options: ['Adik', 'membaca', 'buku', 'perpustakaan'], 
    correct: 'Adik' 
  },
  { 
    id: 2, 
    type: 'S', 
    sentenceParts: [
      { text: '', type: 'S', isBlank: true },
      { text: 'bermain', type: 'P' },
      { text: 'di taman', type: 'K' },
    ],
    options: ['Anak-anak', 'bermain', 'taman', 'bola'], 
    correct: 'Anak-anak' 
  },
  { 
    id: 3, 
    type: 'S', 
    sentenceParts: [
      { text: '', type: 'S', isBlank: true },
      { text: 'memasak', type: 'P' },
      { text: 'nasi goreng', type: 'O' },
    ],
    options: ['Ibu', 'memasak', 'nasi', 'goreng'], 
    correct: 'Ibu' 
  },
  { 
    id: 4, 
    type: 'S', 
    sentenceParts: [
      { text: '', type: 'S', isBlank: true },
      { text: 'tidur', type: 'P' },
      { text: 'di kasur', type: 'K' },
    ],
    options: ['Kucing', 'tidur', 'kasur', 'lembut'], 
    correct: 'Kucing' 
  },
  
  // Predikat (4 soal)
  { 
    id: 5, 
    type: 'P', 
    sentenceParts: [
      { text: 'Ayah', type: 'S' },
      { text: '', type: 'P', isBlank: true },
      { text: 'koran', type: 'O' },
      { text: 'setiap pagi', type: 'K' },
    ],
    options: ['membaca', 'koran', 'pagi', 'Ayah'], 
    correct: 'membaca' 
  },
  { 
    id: 6, 
    type: 'P', 
    sentenceParts: [
      { text: 'Kakak', type: 'S' },
      { text: '', type: 'P', isBlank: true },
      { text: 'sepeda', type: 'O' },
      { text: 'ke sekolah', type: 'K' },
    ],
    options: ['mengendarai', 'sepeda', 'sekolah', 'Kakak'], 
    correct: 'mengendarai' 
  },
  { 
    id: 7, 
    type: 'P', 
    sentenceParts: [
      { text: 'Nenek', type: 'S' },
      { text: '', type: 'P', isBlank: true },
      { text: 'di kursi goyang', type: 'K' },
    ],
    options: ['duduk', 'kursi', 'goyang', 'Nenek'], 
    correct: 'duduk' 
  },
  { 
    id: 8, 
    type: 'P', 
    sentenceParts: [
      { text: 'Burung', type: 'S' },
      { text: '', type: 'P', isBlank: true },
      { text: 'di pohon', type: 'K' },
    ],
    options: ['bernyanyi', 'pohon', 'burung', 'indah'], 
    correct: 'bernyanyi' 
  },
  
  // Objek (4 soal)
  { 
    id: 9, 
    type: 'O', 
    sentenceParts: [
      { text: 'Adik', type: 'S' },
      { text: 'menggambar', type: 'P' },
      { text: '', type: 'O', isBlank: true },
      { text: 'di kertas', type: 'K' },
    ],
    options: ['bunga', 'menggambar', 'kertas', 'Adik'], 
    correct: 'bunga' 
  },
  { 
    id: 10, 
    type: 'O', 
    sentenceParts: [
      { text: 'Ibu', type: 'S' },
      { text: 'mencuci', type: 'P' },
      { text: '', type: 'O', isBlank: true },
      { text: 'di dapur', type: 'K' },
    ],
    options: ['piring', 'mencuci', 'dapur', 'Ibu'], 
    correct: 'piring' 
  },
  { 
    id: 11, 
    type: 'O', 
    sentenceParts: [
      { text: 'Kakak', type: 'S' },
      { text: 'memakai', type: 'P' },
      { text: '', type: 'O', isBlank: true },
      { text: 'baru', type: 'K' },
    ],
    options: ['sepatu', 'memakai', 'baru', 'Kakak'], 
    correct: 'sepatu' 
  },
  { 
    id: 12, 
    type: 'O', 
    sentenceParts: [
      { text: 'Ayah', type: 'S' },
      { text: 'memperbaiki', type: 'P' },
      { text: '', type: 'O', isBlank: true },
      { text: 'yang rusak', type: 'K' },
    ],
    options: ['kursi', 'memperbaiki', 'rusak', 'Ayah'], 
    correct: 'kursi' 
  },
  
  // Keterangan (4 soal)
  { 
    id: 13, 
    type: 'K', 
    sentenceParts: [
      { text: 'Kami', type: 'S' },
      { text: 'belajar', type: 'P' },
      { text: '', type: 'K', isBlank: true },
    ],
    options: ['di sekolah', 'belajar', 'kami', 'guru'], 
    correct: 'di sekolah' 
  },
  { 
    id: 14, 
    type: 'K', 
    sentenceParts: [
      { text: 'Ibu', type: 'S' },
      { text: 'memasak', type: 'P' },
      { text: '', type: 'K', isBlank: true },
    ],
    options: ['setiap hari', 'memasak', 'ibu', 'makanan'], 
    correct: 'setiap hari' 
  },
  { 
    id: 15, 
    type: 'K', 
    sentenceParts: [
      { text: 'Adik', type: 'S' },
      { text: 'menulis', type: 'P' },
      { text: '', type: 'K', isBlank: true },
    ],
    options: ['dengan pensil', 'menulis', 'adik', 'buku'], 
    correct: 'dengan pensil' 
  },
  { 
    id: 16, 
    type: 'K', 
    sentenceParts: [
      { text: 'Ayah', type: 'S' },
      { text: 'berangkat kerja', type: 'P' },
      { text: '', type: 'K', isBlank: true },
    ],
    options: ['pagi hari', 'berangkat', 'ayah', 'kerja'], 
    correct: 'pagi hari' 
  },
];

const typeColors = {
  S: { bg: 'bg-red-500', light: 'bg-red-50', text: 'text-red-600', border: 'border-red-500' },
  P: { bg: 'bg-yellow-500', light: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-500' },
  O: { bg: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-500' },
  K: { bg: 'bg-green-500', light: 'bg-green-50', text: 'text-green-600', border: 'border-green-500' },
};

const typeNames = {
  S: 'Subjek',
  P: 'Predikat',
  O: 'Objek',
  K: 'Keterangan',
};

// Draggable Option Component
const DraggableOption = ({ id, text, isDisabled }) => {
  const { speak } = useTTS();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { text },
    disabled: isDisabled,
  });

  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    opacity: isDragging ? 0.3 : 1,
    touchAction: 'none',
  };

  const handleSpeak = (e) => {
    e.stopPropagation();
    e.preventDefault();
    speak(text);
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className={`relative bg-white border-2 border-gray-200 rounded-xl p-4 font-semibold text-gray-800 
        ${!isDisabled ? 'hover:border-purple-400 hover:bg-purple-50 cursor-grab active:cursor-grabbing' : 'opacity-50'}
        transition-colors`}
    >
      <button
        onPointerDown={handleSpeak}
        className="absolute top-1 right-1 p-1 rounded-full hover:bg-gray-100"
        aria-label={`Dengarkan ${text}`}
      >
        <Volume2 size={14} className="text-purple-600" />
      </button>
      <span>{text}</span>
    </div>
  );
};

// Drop Zone Component
const AnswerDropZone = ({ answer, isCorrect, isWrong }) => {
  const { isOver, setNodeRef } = useDroppable({ id: 'answer-zone' });

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        ref={setNodeRef}
        className={`px-4 py-2 min-w-[80px] rounded-lg flex items-center justify-center font-bold text-lg transition-all
          ${answer 
            ? isCorrect 
              ? 'bg-green-500 text-white'
              : isWrong 
                ? 'bg-red-500 text-white' 
                : 'bg-purple-500 text-white'
            : isOver 
              ? 'bg-purple-200 border-2 border-purple-400 border-dashed' 
              : 'bg-purple-50 border-2 border-purple-300 border-dashed'
          }`}
      >
        {answer || <span className="text-purple-400">?</span>}
      </div>
      {/* Placeholder for speaker icon to maintain alignment */}
      <div className="h-[14px]"></div>
    </div>
  );
};

const MelengkapiKalimat = () => {
  const navigate = useNavigate();
  const { speak } = useTTS();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 8 } })
  );

  const currentQuestion = questions[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion.correct;
  const colors = typeColors[currentQuestion.type];

  // Shuffle options when question changes
  const [shuffledOptions, setShuffledOptions] = useState([]);
  
  useEffect(() => {
    setShuffledOptions(shuffleArray(currentQuestion.options));
    setSelectedAnswer(null);
    setIsAnswered(false);
  }, [currentIndex]);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
        playPopSound();
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && over.id === 'answer-zone' && !isAnswered) {
      const answerText = active.data.current.text;
      setSelectedAnswer(answerText);
      playPopSound();

      // Auto-check answer
      setTimeout(() => {
        setIsAnswered(true);
        if (answerText === currentQuestion.correct) {
          setScore(score + 10);
          setCorrectCount(correctCount + 1);
          playSuccessSound();
          speak('Benar! Hebat!');
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } else {
          playErrorSound();
          speak('Coba lagi ya.');
        }
      }, 300);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setCorrectCount(0);
  };

  const isFinished = currentIndex === questions.length - 1 && isAnswered;

  const getActiveOption = () => {
    if (!activeId) return null;
    // ID format is now "option-{word}"
    return shuffledOptions.find((opt) => `option-${opt}` === activeId);
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
                  <h1 className="text-xl font-bold text-gray-800">Melengkapi Kalimat</h1>
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
              {/* Question Type Badge */}
              <div className="flex justify-center">
                <div className={`${colors.bg} px-6 py-3 rounded-full text-white font-semibold flex items-center gap-2`}>
                  <span className="text-2xl">{currentQuestion.type}</span>
                  <span>-</span>
                  <span>{typeNames[currentQuestion.type]}</span>
                </div>
              </div>

              {/* Question with SPOK labels */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-600">Lengkapi kalimat berikut:</p>
                  <button
                    onClick={() => speak('Lengkapi kalimat berikut')}
                    className="p-2 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors"
                  >
                    <Volume2 size={16} className="text-purple-600" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-6 items-start justify-center">
                  {currentQuestion.sentenceParts.map((part, index) => (
                    <div key={index} className="flex flex-col items-center gap-1">
                      {part.type && (
                        <span className={`${typeColors[part.type].bg} px-2 py-1 rounded text-xs font-bold text-white`}>
                          {part.type}
                        </span>
                      )}
                      {part.isBlank ? (
                        <AnswerDropZone 
                          answer={selectedAnswer}
                          isCorrect={isAnswered && isCorrect}
                          isWrong={isAnswered && !isCorrect}
                        />
                      ) : (
                        <button 
                          onClick={() => speak(part.text)}
                          className="group flex flex-col items-center gap-1 hover:bg-purple-50 px-2 py-1 rounded-lg transition-colors"
                        >
                          <span className="text-lg font-semibold text-gray-800">
                            {part.text}
                          </span>
                          <Volume2 size={14} className="text-purple-400 group-hover:text-purple-600 transition-colors" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-3">
                {shuffledOptions.map((option, index) => (
                  <DraggableOption 
                    key={`${option}-${index}`}
                    id={`option-${option}`}
                    text={option}
                    isDisabled={isAnswered}
                  />
                ))}
              </div>

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
                    <div className="flex items-center gap-3">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                      <div>
                        <p className={`font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                          {isCorrect ? 'Benar! 🎉' : 'Kurang Tepat'}
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-gray-600">
                            Jawaban yang benar: <span className="font-semibold">{currentQuestion.correct}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Button */}
              {isAnswered && (
                <button
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 text-lg rounded-xl transition-all"
                >
                  {currentIndex < questions.length - 1 ? 'Soal Selanjutnya' : 'Lihat Hasil'}
                </button>
              )}
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
                    onClick={handleReset}
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
          {activeId && getActiveOption() && (
            <div className="bg-purple-500 text-white px-4 py-2 rounded-xl font-semibold shadow-lg">
              {getActiveOption()}
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

export default MelengkapiKalimat;
