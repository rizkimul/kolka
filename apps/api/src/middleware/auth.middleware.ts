import type { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

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
      session?: {
        id: string;
        userId: string;
        expiresAt: Date;
      };
    }
  }
}

/**
 * Middleware to verify authentication
 * Attaches user and session to request if valid
 */
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      res.status(401).json({ error: "Unauthorized - No valid session" });
      return;
    }

    // Attach user and session to request
    req.user = session.user;
    req.session = session.session;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Unauthorized - Invalid session" });
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
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (session) {
      req.user = session.user;
      req.session = session.session;
    }

    next();
  } catch (error) {
    // Silently continue without auth
    next();
  }
};
