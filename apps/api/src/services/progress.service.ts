import { eq, desc } from "drizzle-orm";
import { db, schema } from "../db/index.js";
import { NotFoundError, ValidationError } from "../middleware/error.middleware.js";

export interface LevelCompletionInput {
  levelId: string;
  score: number;
  correctCount: number;
  wrongCount: number;
  timeSpentSeconds?: number;
}

export class ProgressService {
  /**
   * Get user's game progress
   */
  async getProgress(userId: string) {
    let progress = await db.query.gameProgress.findFirst({
      where: eq(schema.gameProgress.userId, userId),
    });

    // Initialize if doesn't exist
    if (!progress) {
      [progress] = await db
        .insert(schema.gameProgress)
        .values({
          userId,
          totalScore: 0,
          totalXp: 0,
          currentLevel: 1,
          totalStars: 0,
          questionsAnswered: 0,
          correctAnswers: 0,
        })
        .returning();
    }

    return progress;
  }

  /**
   * Calculate stars based on performance
   * 3 stars: 100% correct
   * 2 stars: 70-99% correct
   * 1 star: 50-69% correct
   * 0 stars: below 50%
   */
  calculateStars(correctCount: number, totalQuestions: number): number {
    if (totalQuestions === 0) return 0;

    const percentage = (correctCount / totalQuestions) * 100;

    if (percentage === 100) return 3;
    if (percentage >= 70) return 2;
    if (percentage >= 50) return 1;
    return 0;
  }

  /**
   * Complete a level and update progress
   */
  async completeLevel(userId: string, data: LevelCompletionInput) {
    const { levelId, score, correctCount, wrongCount, timeSpentSeconds } = data;

    // Verify level exists
    const level = await db.query.levels.findFirst({
      where: eq(schema.levels.id, levelId),
    });

    if (!level) {
      throw new NotFoundError("Level");
    }

    // Calculate total questions from input
    const totalQuestions = correctCount + wrongCount;

    // Calculate stars
    const stars = this.calculateStars(correctCount, totalQuestions);

    // Calculate XP (10 per correct answer + bonus for stars)
    const baseXp = correctCount * 10;
    const starBonus = stars * 5;
    const xpGained = baseXp + starBonus;

    // Create level completion record
    const [completion] = await db
      .insert(schema.levelCompletions)
      .values({
        userId,
        levelId,
        score,
        stars,
        correctCount,
        wrongCount,
        timeSpentSeconds,
      })
      .returning();

    // Update overall progress
    await this.updateStats(userId, xpGained, score, correctCount, totalQuestions, stars);

    return {
      ...completion,
      xpGained,
      starBonus,
    };
  }

  /**
   * Update user's overall stats
   */
  async updateStats(
    userId: string,
    xpGained: number,
    scoreGained: number,
    correctCount: number,
    questionsAnswered: number,
    starsGained: number
  ) {
    const progress = await this.getProgress(userId);

    // Calculate new level based on XP (every 100 XP = 1 level)
    const newTotalXp = progress.totalXp + xpGained;
    const newLevel = Math.floor(newTotalXp / 100) + 1;

    await db
      .update(schema.gameProgress)
      .set({
        totalScore: progress.totalScore + scoreGained,
        totalXp: newTotalXp,
        currentLevel: newLevel,
        totalStars: progress.totalStars + starsGained,
        questionsAnswered: progress.questionsAnswered + questionsAnswered,
        correctAnswers: progress.correctAnswers + correctCount,
        lastPlayedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(schema.gameProgress.userId, userId));
  }

  /**
   * Get user's completion history
   */
  async getCompletionHistory(userId: string) {
    const completions = await db.query.levelCompletions.findMany({
      where: eq(schema.levelCompletions.userId, userId),
      with: {
        level: true,
      },
      orderBy: desc(schema.levelCompletions.completedAt),
    });

    return completions;
  }
}

export const progressService = new ProgressService();
