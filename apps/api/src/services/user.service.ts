import { eq } from "drizzle-orm";
import { db, schema } from "../db/index.js";
import { NotFoundError } from "../middleware/error.middleware.js";

export class UserService {
  /**
   * Get user profile with game progress
   */
  async getProfile(userId: string) {
    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, userId),
      with: {
        gameProgress: true,
      },
    });

    if (!user) {
      throw new NotFoundError("User");
    }

    return user;
  }

  /**
   * Update user profile (name, avatar/image)
   */
  async updateProfile(
    userId: string,
    data: { name?: string; image?: string }
  ) {
    const [updated] = await db
      .update(schema.users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, userId))
      .returning();

    if (!updated) {
      throw new NotFoundError("User");
    }

    return updated;
  }

  /**
   * Initialize game progress for new user
   */
  async initializeProgress(userId: string) {
    // Check if progress already exists
    const existing = await db.query.gameProgress.findFirst({
      where: eq(schema.gameProgress.userId, userId),
    });

    if (existing) {
      return existing;
    }

    // Create new progress
    const [progress] = await db
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

    return progress;
  }

  /**
   * Get public stats for leaderboard display
   */
  async getPublicStats(userId: string) {
    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, userId),
      columns: {
        id: true,
        name: true,
        image: true,
      },
      with: {
        gameProgress: {
          columns: {
            totalScore: true,
            totalStars: true,
            currentLevel: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError("User");
    }

    return {
      id: user.id,
      name: user.name,
      image: user.image,
      totalScore: user.gameProgress?.totalScore ?? 0,
      totalStars: user.gameProgress?.totalStars ?? 0,
      currentLevel: user.gameProgress?.currentLevel ?? 1,
    };
  }
}

export const userService = new UserService();
