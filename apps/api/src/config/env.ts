import "dotenv/config";

export const env = {
  // Database
  DATABASE_URL: process.env.DATABASE_URL?.trim()!,

  // Server
  PORT: parseInt(process.env.PORT || "3001", 10),
  NODE_ENV: process.env.NODE_ENV || "development",

  // Frontend URL (for CORS)
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",

  // JWT Secret
  JWT_SECRET: process.env.JWT_SECRET || process.env.BETTER_AUTH_SECRET!,
} as const;

// Validate required environment variables
const requiredEnvVars = ["DATABASE_URL"] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Validate JWT secret
if (!process.env.JWT_SECRET && !process.env.BETTER_AUTH_SECRET) {
  throw new Error("Missing required environment variable: JWT_SECRET");
}
