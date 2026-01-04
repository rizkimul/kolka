// Re-export types from schema
export type {
  User,
  NewUser,
  Session,
  NewSession,
  GameProgress,
  NewGameProgress,
  Level,
  NewLevel,
  LevelCompletion,
  NewLevelCompletion,
  Question,
  NewQuestion,
  QuestionOption,
} from "../db/schema.js";

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Level with status (for frontend)
export interface LevelWithStatus {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  example: string | null;
  variant: string;
  order: number;
  requiredStars: number;
  isLocked: boolean;
  completed: boolean;
  bestStars: number;
  bestScore: number;
}

// User profile with progress
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image: string | null;
  gameProgress: {
    totalScore: number;
    totalXp: number;
    currentLevel: number;
    totalStars: number;
    questionsAnswered: number;
    correctAnswers: number;
  } | null;
}

// Leaderboard entry
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  image: string | null;
  totalScore: number;
  totalStars: number;
  currentLevel: number;
}

// Answer validation result
export interface AnswerResult {
  correct: boolean;
  correctAnswer: string;
  message: string;
}

// Level completion result
export interface LevelCompletionResult {
  id: string;
  userId: string;
  levelId: string;
  score: number;
  stars: number;
  correctCount: number;
  wrongCount: number;
  xpGained: number;
  starBonus: number;
  completedAt: Date;
}
