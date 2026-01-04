import { Router } from "express";
import { progressService } from "../services/progress.service.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../middleware/error.middleware.js";
import { z } from "zod";

const router = Router();

// Validation schema
const levelCompletionSchema = z.object({
  score: z.number().int().min(0),
  correctCount: z.number().int().min(0),
  wrongCount: z.number().int().min(0),
  timeSpentSeconds: z.number().int().min(0).optional(),
});

/**
 * GET /api/progress
 * Get current user's game progress
 */
router.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const progress = await progressService.getProgress(req.user!.id);
    res.json(progress);
  })
);

/**
 * POST /api/progress/levels/:levelId/complete
 * Submit level completion
 */
router.post(
  "/levels/:levelId/complete",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = levelCompletionSchema.parse(req.body);
    
    const result = await progressService.completeLevel(req.user!.id, {
      levelId: req.params.levelId,
      ...data,
    });

    res.json({
      message: "Level selesai!",
      ...result,
    });
  })
);

/**
 * GET /api/progress/history
 * Get user's level completion history
 */
router.get(
  "/history",
  requireAuth,
  asyncHandler(async (req, res) => {
    const history = await progressService.getCompletionHistory(req.user!.id);
    res.json(history);
  })
);

export default router;
