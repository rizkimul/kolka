import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import routes from "./routes/index.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { env } from "./config/env.js";

const app = express();

// Trust proxy for Vercel to allow secure cookies
app.set("trust proxy", 1);

// CORS configuration
app.use(
  cors({
    origin: [env.FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);



// Better Auth handler MUST be before express.json()
// This handles all /api/auth/* routes
app.all("/api/auth/*", (req, res, next) => {
  // Log request info
  console.log(`\n=== Auth Request: ${req.method} ${req.path} ===`);
  console.log("Request Origin:", req.headers.origin);
  
  // Log response headers when finished
  res.on("finish", () => {
    console.log("Response Set-Cookie:", res.getHeader("set-cookie"));
  });
  
  return toNodeHandler(auth)(req, res);
});

// JSON parsing for other routes
app.use(express.json());

// API Routes
app.use("/api", routes);

// Error handling middleware (must be last)
app.use(errorMiddleware);

export default app;
