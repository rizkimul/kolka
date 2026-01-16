import { eq, asc } from "drizzle-orm";
import { db, schema } from "../db/index.js";
import { NotFoundError } from "../middleware/error.middleware.js";

export class LevelService {
  /**
   * Get all levels with user's completion status and unlock state
   */
  async getAllLevels(userId: string) {
    // Get user's progress to check stars
    const userProgress = await db.query.gameProgress.findFirst({
      where: eq(schema.gameProgress.userId, userId),
    });

    const totalStars = userProgress?.totalStars ?? 0;

    // Get all levels ordered
    const levels = await db.query.levels.findMany({
      orderBy: asc(schema.levels.order),
    });

    // Get user's best completion for each level
    const completions = await db.query.levelCompletions.findMany({
      where: eq(schema.levelCompletions.userId, userId),
    });

    // Create completion map (best stars per level)
    const completionMap = new Map<string, { stars: number; score: number }>();
    for (const c of completions) {
      const existing = completionMap.get(c.levelId);
      if (!existing || c.stars > existing.stars) {
        completionMap.set(c.levelId, { stars: c.stars, score: c.score });
      }
    }

    // Map levels with status
    return levels.map((level) => {
      const completion = completionMap.get(level.id);
      const isUnlocked = totalStars >= level.requiredStars;

      return {
        ...level,
        isLocked: !isUnlocked,
        completed: !!completion,
        bestStars: completion?.stars ?? 0,
        bestScore: completion?.score ?? 0,
      };
    });
  }

  /**
   * Get single level by slug
   */
  async getLevelBySlug(slug: string) {
    const level = await db.query.levels.findFirst({
      where: eq(schema.levels.slug, slug),
    });

    if (!level) {
      throw new NotFoundError("Level");
    }

    return level;
  }



  /**
   * Check if a level is unlocked for a user
   */
  async isLevelUnlocked(userId: string, levelId: string): Promise<boolean> {
    const level = await db.query.levels.findFirst({
      where: eq(schema.levels.id, levelId),
    });

    if (!level) {
      throw new NotFoundError("Level");
    }

    const userProgress = await db.query.gameProgress.findFirst({
      where: eq(schema.gameProgress.userId, userId),
    });

    const totalStars = userProgress?.totalStars ?? 0;
    return totalStars >= level.requiredStars;
  }
}

export const levelService = new LevelService();
