import { Router } from "express";
import usersRoutes from "./users.routes.js";
import levelsRoutes from "./levels.routes.js";
import questionsRoutes from "./questions.routes.js";
import progressRoutes from "./progress.routes.js";
import leaderboardRoutes from "./leaderboard.routes.js";

const router = Router();

// Health check
router.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    service: "kolka-api",
  });
});

// Mount routes
router.use("/users", usersRoutes);
router.use("/levels", levelsRoutes);
router.use("/questions", questionsRoutes);
router.use("/progress", progressRoutes);
router.use("/leaderboard", leaderboardRoutes);

export default router;
