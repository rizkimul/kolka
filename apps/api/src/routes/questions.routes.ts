import { Router } from "express";
import { questionService } from "../services/question.service.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../middleware/error.middleware.js";
import { z } from "zod";

const router = Router();

// Validation schema
const answerSchema = z.object({
  answer: z.string().min(1, "Jawaban tidak boleh kosong"),
});

/**
 * GET /api/questions/:id
 * Get a single question by ID
 */
router.get(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const question = await questionService.getQuestion(req.params.id);
    res.json(question);
  })
);

/**
 * POST /api/questions/:id/answer
 * Submit an answer for validation
 */
router.post(
  "/:id/answer",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { answer } = answerSchema.parse(req.body);
    const result = await questionService.validateAnswer(req.params.id, answer);
    res.json(result);
  })
);

/**
 * GET /api/questions/level/:slug
 * Get all questions for a level by slug
 */
router.get(
  "/level/:slug",
  requireAuth,
  asyncHandler(async (req, res) => {
    const questions = await questionService.getQuestionsByLevelSlug(req.params.slug);
    res.json(questions);
  })
);

export default router;
