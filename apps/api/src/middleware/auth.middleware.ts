import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt.js";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        image?: string | null;
      };
    }
  }
}

/**
 * Middleware to verify JWT authentication
 * Attaches user to request if valid
 */
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized - No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);

    // Fetch user from database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (!user) {
      res.status(401).json({ error: "Unauthorized - User not found" });
      return;
    }

    // Attach user to request
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};

/**
 * Optional auth middleware - doesn't require auth but attaches user if present
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const payload = verifyToken(token);

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, payload.userId))
        .limit(1);

      if (user) {
        req.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      }
    }

    next();
  } catch (error) {
    // Silently continue without auth
    next();
  }
};
