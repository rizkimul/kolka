import { Router } from "express";
import { userService } from "../services/user.service.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../middleware/error.middleware.js";
import { z } from "zod";

const router = Router();

// Validation schema
const updateProfileSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").optional(),
  image: z.string().optional(), // Avatar emoji or URL
});

/**
 * GET /api/users/me
 * Get current user profile with game progress
 */
router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const profile = await userService.getProfile(req.user!.id);
    res.json(profile);
  })
);

/**
 * PATCH /api/users/me
 * Update current user profile
 */
router.patch(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = updateProfileSchema.parse(req.body);
    const updated = await userService.updateProfile(req.user!.id, data);
    res.json(updated);
  })
);

/**
 * POST /api/users/me/init-progress
 * Initialize game progress for user (called after registration)
 */
router.post(
  "/me/init-progress",
  requireAuth,
  asyncHandler(async (req, res) => {
    const progress = await userService.initializeProgress(req.user!.id);
    res.json(progress);
  })
);

/**
 * GET /api/users/:id/stats
 * Get user's public stats (for leaderboard display)
 */
router.get(
  "/:id/stats",
  asyncHandler(async (req, res) => {
    const stats = await userService.getPublicStats(req.params.id);
    res.json(stats);
  })
);

export default router;
