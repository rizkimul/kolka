import { Router } from "express";
import { leaderboardService } from "../services/leaderboard.service.js";
import { requireAuth, optionalAuth } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../middleware/error.middleware.js";

const router = Router();

/**
 * GET /api/leaderboard
 * Get global all-time leaderboard
 */
router.get(
  "/",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const leaderboard = await leaderboardService.getGlobalLeaderboard(limit);
    res.json(leaderboard);
  })
);

/**
 * GET /api/leaderboard/weekly
 * Get weekly leaderboard
 */
router.get(
  "/weekly",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const leaderboard = await leaderboardService.getWeeklyLeaderboard(limit);
    res.json(leaderboard);
  })
);

/**
 * GET /api/leaderboard/me
 * Get current user's rank
 */
router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const rank = await leaderboardService.getUserRank(req.user!.id);
    res.json(rank);
  })
);

export default router;
