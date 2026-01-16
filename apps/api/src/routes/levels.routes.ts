import { Router } from "express";
import { levelService } from "../services/level.service.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { asyncHandler, NotFoundError } from "../middleware/error.middleware.js";

const router = Router();

/**
 * GET /api/levels
 * Get all levels with user's completion status
 */
router.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const levels = await levelService.getAllLevels(req.user!.id);
    res.json(levels);
  })
);

/**
 * GET /api/levels/:slug
 * Get single level by slug with questions
 */
router.get(
  "/:slug",
  requireAuth,
  asyncHandler(async (req, res) => {
    const level = await levelService.getLevelBySlug(req.params.slug);
    
    // Check if unlocked
    const isUnlocked = await levelService.isLevelUnlocked(req.user!.id, level.id);
    
    if (!isUnlocked) {
      res.status(403).json({ 
        error: "Level ini masih terkunci. Kumpulkan lebih banyak bintang!" 
      });
      return;
    }

    res.json({
      ...level,
    });
  })
);



export default router;
