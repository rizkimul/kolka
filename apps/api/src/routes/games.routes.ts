import { Router } from "express";
import { gamesService } from "../services/games.service.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../middleware/error.middleware.js";

const router = Router();

/**
 * GET /api/games/melengkapi-kalimat/questions
 * Get all questions for Melengkapi Kalimat game
 */
router.get(
  "/melengkapi-kalimat/questions",
  requireAuth,
  asyncHandler(async (req, res) => {
    const questions = await gamesService.getMelengkapiKalimatQuestions();
    res.json(questions);
  })
);

/**
 * GET /api/games/menyusun-kalimat/questions
 * Get all questions for Menyusun Kalimat game
 */
router.get(
  "/menyusun-kalimat/questions",
  requireAuth,
  asyncHandler(async (req, res) => {
    const questions = await gamesService.getMenyusunKalimatQuestions();
    res.json(questions);
  })
);

export default router;
