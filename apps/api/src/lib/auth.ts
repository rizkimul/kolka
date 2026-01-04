import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/index.js";
import * as schema from "../db/schema.js";
import { env } from "../config/env.js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  basePath: "/api/auth", // Auth routes are mounted at /api/auth/*
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Simplified for children's app
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  advanced: {
    cookiePrefix: "kolka-app",
    useSecureCookies: env.NODE_ENV === "production",
    defaultCookieAttributes: {
      path: "/", // Ensure cookies are sent to all routes
      sameSite: "lax", // Use 'lax' since we're using a proxy (same-origin)
      secure: env.NODE_ENV === "production",
    },
  },
  trustedOrigins: [env.FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"],
});

// Export auth types for use in middleware
export type Auth = typeof auth;
