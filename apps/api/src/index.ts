import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import routes from "./routes/index.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { env } from "./config/env.js";

const app = express();

// CORS configuration
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

// Better Auth handler MUST be before express.json()
// This handles all /api/auth/* routes
app.all("/api/auth/*", toNodeHandler(auth));

// JSON parsing for other routes
app.use(express.json());

// API Routes
app.use("/api", routes);

// Error handling middleware (must be last)
app.use(errorMiddleware);

// Start server
app.listen(env.PORT, () => {
  console.log(`
  🚀 KOLKA API Server
  ==================
  Environment: ${env.NODE_ENV}
  Port: ${env.PORT}
  Frontend: ${env.FRONTEND_URL}
  
  Available endpoints:
  - POST /api/auth/sign-up/email
  - POST /api/auth/sign-in/email
  - POST /api/auth/sign-out
  - GET  /api/auth/session
  - GET  /api/health
  - GET  /api/users/me
  - GET  /api/levels
  - GET  /api/progress
  - GET  /api/leaderboard
  `);
});

export default app;
