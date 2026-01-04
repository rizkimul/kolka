import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env.js";

/**
 * Custom error class with status code
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

/**
 * Not found error
 */
export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super(404, `${resource} tidak ditemukan`);
    this.name = "NotFoundError";
  }
}

/**
 * Validation error
 */
export class ValidationError extends AppError {
  constructor(message: string = "Data tidak valid") {
    super(400, message);
    this.name = "ValidationError";
  }
}

/**
 * Global error handling middleware
 */
export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("Error:", err);

  // Handle known AppError types
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      type: err.name,
    });
    return;
  }

  // Handle Zod validation errors
  if (err.name === "ZodError") {
    res.status(400).json({
      error: "Data tidak valid",
      type: "ValidationError",
      details: (err as any).errors,
    });
    return;
  }

  // Handle database errors
  if (err.message?.includes("duplicate key")) {
    res.status(409).json({
      error: "Data sudah ada",
      type: "ConflictError",
    });
    return;
  }

  // Default error response
  const isDev = env.NODE_ENV === "development";
  res.status(500).json({
    error: "Terjadi kesalahan server",
    type: "InternalServerError",
    ...(isDev && { details: err.message, stack: err.stack }),
  });
};

/**
 * Async handler wrapper to catch errors
 */
export const asyncHandler = <T>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
