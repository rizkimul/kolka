import { eq } from "drizzle-orm";
import { db, schema } from "../db/index.js";
import { NotFoundError } from "../middleware/error.middleware.js";
import type { QuestionOption } from "../db/schema.js";

export interface AnswerResult {
  correct: boolean;
  correctAnswer: string;
  message: string;
}

export class QuestionService {
  /**
   * Get a single question by ID
   */
  async getQuestion(id: string) {
    const question = await db.query.questions.findFirst({
      where: eq(schema.questions.id, id),
    });

    if (!question) {
      throw new NotFoundError("Pertanyaan");
    }

    return question;
  }

  /**
   * Validate an answer for a question
   */
  async validateAnswer(questionId: string, answer: string): Promise<AnswerResult> {
    const question = await this.getQuestion(questionId);

    const isCorrect = answer === question.correctAnswer;

    return {
      correct: isCorrect,
      correctAnswer: question.correctAnswer,
      message: isCorrect ? "Hebat! Jawabanmu benar!" : "Coba lagi ya.",
    };
  }

  /**
   * Get questions by level slug
   */
  async getQuestionsByLevelSlug(slug: string) {
    const level = await db.query.levels.findFirst({
      where: eq(schema.levels.slug, slug),
    });

    if (!level) {
      throw new NotFoundError("Level");
    }

    const questions = await db.query.questions.findMany({
      where: eq(schema.questions.levelId, level.id),
      orderBy: (questions, { asc }) => [asc(questions.order)],
    });

    return questions.filter((q) => q.isActive).map((q) => ({
      ...q,
      options: q.options as QuestionOption[],
    }));
  }
}

export const questionService = new QuestionService();
