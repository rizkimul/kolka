import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { questionsApi, progressApi, levelsApi } from '../services/api';

const GameContext = createContext();

const initialState = {
  activeLevel: null,
  levelId: null, // Database level ID for progress submission
  questions: [],
  currentIndex: 0,
  score: 0,
  correctCount: 0,
  wrongCount: 0,
  isCompleted: false,
  status: 'idle', // idle, loading, playing, success, error, finished
  error: null,
  startTime: null,
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'LOADING':
      return {
        ...initialState,
        status: 'loading',
      };

    case 'START_LEVEL':
      return {
        ...initialState,
        activeLevel: action.payload.slug,
        levelId: action.payload.levelId,
        questions: action.payload.questions,
        status: 'playing',
        startTime: Date.now(),
      };

    case 'LOAD_ERROR':
      return {
        ...state,
        status: 'idle',
        error: action.payload,
      };

    case 'ANSWER_CORRECT':
      return {
        ...state,
        score: state.score + 10,
        correctCount: state.correctCount + 1,
        status: 'success',
      };

    case 'ANSWER_WRONG':
      return {
        ...state,
        wrongCount: state.wrongCount + 1,
        status: 'error',
      };

    case 'NEXT_QUESTION':
      if (state.currentIndex >= state.questions.length - 1) {
        return { ...state, isCompleted: true, status: 'finished' };
      }
      return {
        ...state,
        currentIndex: state.currentIndex + 1,
        status: 'playing',
      };

    case 'RESET_STATUS':
      return { ...state, status: 'playing' };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
};

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  /**
   * Start a level by fetching questions from API
   */
  const startLevel = useCallback(async (levelSlug) => {
    dispatch({ type: 'LOADING' });

    try {
      // Fetch level data with questions
      const levelData = await levelsApi.getBySlug(levelSlug);
      
      if (!levelData.questions || levelData.questions.length === 0) {
        throw new Error('Tidak ada soal untuk level ini');
      }

      dispatch({
        type: 'START_LEVEL',
        payload: {
          slug: levelSlug,
          levelId: levelData.id,
          questions: levelData.questions,
        },
      });
    } catch (error) {
      console.error('Failed to load level:', error);
      dispatch({ type: 'LOAD_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  /**
   * Submit an answer (validates locally for instant feedback)
   */
  const submitAnswer = useCallback((answer) => {
    const currentQuestion = state.questions[state.currentIndex];

    if (answer === currentQuestion.correctAnswer) {
      dispatch({ type: 'ANSWER_CORRECT' });
      return true;
    } else {
      dispatch({ type: 'ANSWER_WRONG' });
      return false;
    }
  }, [state.questions, state.currentIndex]);

  /**
   * Move to next question
   */
  const nextQuestion = useCallback(() => {
    dispatch({ type: 'NEXT_QUESTION' });
  }, []);

  /**
   * Reset status after animation
   */
  const resetStatus = useCallback(() => {
    dispatch({ type: 'RESET_STATUS' });
  }, []);

  /**
   * Submit level completion to backend
   */
  const submitLevelCompletion = useCallback(async () => {
    if (!state.levelId) {
      console.error('No level ID to submit');
      return null;
    }

    const timeSpentSeconds = state.startTime
      ? Math.floor((Date.now() - state.startTime) / 1000)
      : 0;

    try {
      const result = await progressApi.completeLevel(state.levelId, {
        score: state.score,
        correctCount: state.correctCount,
        wrongCount: state.wrongCount,
        timeSpentSeconds,
      });

      return result;
    } catch (error) {
      console.error('Failed to submit level completion:', error);
      throw error;
    }
  }, [state.levelId, state.score, state.correctCount, state.wrongCount, state.startTime]);

  /**
   * Reset game state
   */
  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return (
    <GameContext.Provider
      value={{
        state,
        startLevel,
        submitAnswer,
        nextQuestion,
        resetStatus,
        submitLevelCompletion,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
