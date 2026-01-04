import { pgTable, uuid, text, timestamp, boolean, integer, jsonb, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================
// Better Auth Required Tables
// Note: Better Auth generates its own string IDs, so we use text() not uuid()
// ============================================

export const users = pgTable("users", {
  id: text("id").primaryKey(), // Better Auth generates string IDs
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false),
  image: text("image"), // Avatar emoji or URL
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(), // Better Auth generates string IDs
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(), // Better Auth generates string IDs
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  password: text("password"), // Required for email/password auth
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  idToken: text("id_token"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(), // Better Auth generates string IDs
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================
// Game Domain Tables
// ============================================

export const gameProgress = pgTable("game_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id") // References Better Auth user (text ID)
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  totalScore: integer("total_score").default(0).notNull(),
  totalXp: integer("total_xp").default(0).notNull(),
  currentLevel: integer("current_level").default(1).notNull(),
  totalStars: integer("total_stars").default(0).notNull(),
  questionsAnswered: integer("questions_answered").default(0).notNull(),
  correctAnswers: integer("correct_answers").default(0).notNull(),
  lastPlayedAt: timestamp("last_played_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const levels = pgTable("levels", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(), // 'subject', 'predicate', 'object', 'adverb'
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  example: text("example"),
  variant: text("variant").notNull(), // For styling
  order: integer("order").notNull(),
  requiredStars: integer("required_stars").default(0).notNull(), // Stars needed to unlock
  isLocked: boolean("is_locked").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const levelCompletions = pgTable(
  "level_completions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id") // References Better Auth user (text ID)
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    levelId: uuid("level_id")
      .notNull()
      .references(() => levels.id, { onDelete: "cascade" }),
    score: integer("score").notNull(),
    stars: integer("stars").notNull(), // 0-3 stars
    correctCount: integer("correct_count").notNull(),
    wrongCount: integer("wrong_count").notNull(),
    timeSpentSeconds: integer("time_spent_seconds"),
    completedAt: timestamp("completed_at").defaultNow().notNull(),
  },
  (table) => ({
    userLevelIdx: index("user_level_idx").on(table.userId, table.levelId),
  })
);

export const questions = pgTable("questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  levelId: uuid("level_id")
    .notNull()
    .references(() => levels.id, { onDelete: "cascade" }),
  sentence: text("sentence").notNull(), // "_____ bermain bola di lapangan"
  missingPart: text("missing_part").notNull(), // 'subject', 'predicate', 'object', 'adverb'
  correctAnswer: text("correct_answer").notNull(),
  options: jsonb("options").notNull(), // Array of {id, text, type, image}
  contextImage: text("context_image"), // Emoji representation
  order: integer("order").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// Relations
// ============================================

export const usersRelations = relations(users, ({ one, many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  gameProgress: one(gameProgress),
  levelCompletions: many(levelCompletions),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const gameProgressRelations = relations(gameProgress, ({ one }) => ({
  user: one(users, { fields: [gameProgress.userId], references: [users.id] }),
}));

export const levelsRelations = relations(levels, ({ many }) => ({
  questions: many(questions),
  completions: many(levelCompletions),
}));

export const levelCompletionsRelations = relations(levelCompletions, ({ one }) => ({
  user: one(users, { fields: [levelCompletions.userId], references: [users.id] }),
  level: one(levels, { fields: [levelCompletions.levelId], references: [levels.id] }),
}));

export const questionsRelations = relations(questions, ({ one }) => ({
  level: one(levels, { fields: [questions.levelId], references: [levels.id] }),
}));

// ============================================
// Type Exports
// ============================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type GameProgress = typeof gameProgress.$inferSelect;
export type NewGameProgress = typeof gameProgress.$inferInsert;

export type Level = typeof levels.$inferSelect;
export type NewLevel = typeof levels.$inferInsert;

export type LevelCompletion = typeof levelCompletions.$inferSelect;
export type NewLevelCompletion = typeof levelCompletions.$inferInsert;

export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;

export type QuestionOption = {
  id: string;
  text: string;
  type: string;
  image: string;
};
