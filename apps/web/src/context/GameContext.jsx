import React, { createContext, useContext, useState, useReducer } from 'react';
import { QUESTIONS } from '../data/questions';

const GameContext = createContext();

const initialState = {
  activeLevel: null,
  questions: [],
  currentIndex: 0,
  score: 0,
  correctCount: 0,
  wrongCount: 0,
  isCompleted: false,
  status: 'idle', // idle, playing, success, error, finished
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'START_LEVEL':
      const levelQuestions = QUESTIONS[action.payload] || [];
      return {
        ...initialState,
        activeLevel: action.payload,
        questions: levelQuestions,
        status: 'playing'
      };
    
    case 'ANSWER_CORRECT':
      const nextIndex = state.currentIndex + 1;
      const isFinished = nextIndex >= state.questions.length;
      return {
        ...state,
        score: state.score + 10,
        correctCount: state.correctCount + 1,
        status: 'success'
        // Index update handles in effect/timeout for smooth transition
      };

    case 'ANSWER_WRONG':
      return {
        ...state,
        wrongCount: state.wrongCount + 1,
        status: 'error' // Triggers shake animation
      };

    case 'NEXT_QUESTION':
      if (state.currentIndex >= state.questions.length - 1) {
        return { ...state, isCompleted: true, status: 'finished' };
      }
      return {
        ...state,
        currentIndex: state.currentIndex + 1,
        status: 'playing'
      };

    case 'RESET_STATUS':
      return { ...state, status: 'playing' };
      
    default:
      return state;
  }
};

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const startLevel = (levelId) => {
    dispatch({ type: 'START_LEVEL', payload: levelId });
  };

  const submitAnswer = (answer) => {
    const currentQuestion = state.questions[state.currentIndex];
    
    if (answer === currentQuestion.correctAnswer) {
      dispatch({ type: 'ANSWER_CORRECT' });
      // Helper to auto advance after animation
      return true;
    } else {
      dispatch({ type: 'ANSWER_WRONG' });
      return false;
    }
  };

  const nextQuestion = () => {
    dispatch({ type: 'NEXT_QUESTION' });
  };

  const resetStatus = () => {
    dispatch({ type: 'RESET_STATUS' });
  };

  return (
    <GameContext.Provider value={{ 
      state, 
      startLevel, 
      submitAnswer, 
      nextQuestion,
      resetStatus
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
