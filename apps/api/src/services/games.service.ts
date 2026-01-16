import { eq } from "drizzle-orm";
import { db, schema } from "../db/index.js";
import {
  MelengkapiKalimatQuestion,
  MenyusunKalimatQuestion,
} from "../db/schema.js";

export class GamesService {
  /**
   * Get all active questions for Melengkapi Kalimat game
   */
  async getMelengkapiKalimatQuestions() {
    const questions = await db.query.melengkapiKalimatQuestions.findMany({
      where: eq(schema.melengkapiKalimatQuestions.isActive, true),
      orderBy: (questions, { asc }) => [asc(questions.order)],
    });

    return questions as MelengkapiKalimatQuestion[];
  }

  /**
   * Get all active questions for Menyusun Kalimat game
   */
  async getMenyusunKalimatQuestions() {
    const questions = await db.query.menyusunKalimatQuestions.findMany({
      where: eq(schema.menyusunKalimatQuestions.isActive, true),
      orderBy: (questions, { asc }) => [asc(questions.order)],
    });

    return questions as MenyusunKalimatQuestion[];
  }
}

export const gamesService = new GamesService();
