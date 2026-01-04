import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import routes from "./routes/index.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { env } from "./config/env.js";

const app = express();

// Trust proxy for Vercel
app.set("trust proxy", 1);

// CORS configuration
app.use(
  cors({
    origin: [env.FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// JSON parsing
app.use(express.json());

// Auth Routes
app.use("/api/auth", authRoutes);

// API Routes
app.use("/api", routes);

// Error handling middleware (must be last)
app.use(errorMiddleware);

export default app;
