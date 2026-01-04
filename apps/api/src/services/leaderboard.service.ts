import { desc, sql, gte } from "drizzle-orm";
import { db, schema } from "../db/index.js";

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  image: string | null;
  totalScore: number;
  totalStars: number;
  currentLevel: number;
}

export class LeaderboardService {
  /**
   * Get global all-time leaderboard
   */
  async getGlobalLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    const results = await db
      .select({
        userId: schema.gameProgress.userId,
        totalScore: schema.gameProgress.totalScore,
        totalStars: schema.gameProgress.totalStars,
        currentLevel: schema.gameProgress.currentLevel,
        name: schema.users.name,
        image: schema.users.image,
      })
      .from(schema.gameProgress)
      .innerJoin(schema.users, sql`${schema.gameProgress.userId} = ${schema.users.id}`)
      .orderBy(desc(schema.gameProgress.totalScore))
      .limit(limit);

    return results.map((row, index) => ({
      rank: index + 1,
      userId: row.userId,
      name: row.name,
      image: row.image,
      totalScore: row.totalScore,
      totalStars: row.totalStars,
      currentLevel: row.currentLevel,
    }));
  }

  /**
   * Get weekly leaderboard (based on completions in last 7 days)
   */
  async getWeeklyLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Aggregate scores from completions in the last week
    const results = await db
      .select({
        userId: schema.levelCompletions.userId,
        weeklyScore: sql<number>`SUM(${schema.levelCompletions.score})`.as("weekly_score"),
        weeklyStars: sql<number>`SUM(${schema.levelCompletions.stars})`.as("weekly_stars"),
        name: schema.users.name,
        image: schema.users.image,
        currentLevel: schema.gameProgress.currentLevel,
      })
      .from(schema.levelCompletions)
      .innerJoin(schema.users, sql`${schema.levelCompletions.userId} = ${schema.users.id}`)
      .leftJoin(schema.gameProgress, sql`${schema.levelCompletions.userId} = ${schema.gameProgress.userId}`)
      .where(gte(schema.levelCompletions.completedAt, weekAgo))
      .groupBy(
        schema.levelCompletions.userId,
        schema.users.name,
        schema.users.image,
        schema.gameProgress.currentLevel
      )
      .orderBy(sql`weekly_score DESC`)
      .limit(limit);

    return results.map((row, index) => ({
      rank: index + 1,
      userId: row.userId,
      name: row.name,
      image: row.image,
      totalScore: row.weeklyScore ?? 0,
      totalStars: row.weeklyStars ?? 0,
      currentLevel: row.currentLevel ?? 1,
    }));
  }

  /**
   * Get user's rank in global leaderboard
   */
  async getUserRank(userId: string): Promise<{ rank: number; totalPlayers: number }> {
    // Get user's score
    const userProgress = await db.query.gameProgress.findFirst({
      where: sql`${schema.gameProgress.userId} = ${userId}`,
    });

    if (!userProgress) {
      return { rank: 0, totalPlayers: 0 };
    }

    // Count players with higher score
    const [result] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(schema.gameProgress)
      .where(sql`${schema.gameProgress.totalScore} > ${userProgress.totalScore}`);

    const higherCount = result?.count ?? 0;

    // Get total players
    const [totalResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(schema.gameProgress);

    const totalPlayers = totalResult?.count ?? 0;

    return {
      rank: higherCount + 1,
      totalPlayers,
    };
  }
}

export const leaderboardService = new LeaderboardService();
