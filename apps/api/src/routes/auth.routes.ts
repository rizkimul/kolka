import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "../db/index.js";
import { users, accounts } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { generateToken, verifyToken } from "../lib/jwt.js";
import { asyncHandler } from "../middleware/error.middleware.js";
import { randomUUID } from "crypto";

const router = Router();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  name: z.string().min(2, "Nama minimal 2 karakter"),
});

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const data = registerSchema.parse(req.body);

    // Check if email already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);

    if (existingUser.length > 0) {
      res.status(400).json({ error: "Email sudah terdaftar" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const userId = randomUUID();
    const [newUser] = await db
      .insert(users)
      .values({
        id: userId,
        email: data.email,
        name: data.name,
        emailVerified: false,
      })
      .returning();

    // Create account (for storing password)
    await db.insert(accounts).values({
      id: randomUUID(),
      userId: userId,
      accountId: userId,
      providerId: "credentials",
      password: hashedPassword,
    });

    // Generate token
    const token = generateToken(newUser.id, newUser.email);

    res.status(201).json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        image: newUser.image,
      },
      token,
    });
  })
);

/**
 * POST /api/auth/login
 * Login with email and password
 */
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const data = loginSchema.parse(req.body);

    // Find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);

    if (!user) {
      res.status(401).json({ error: "Email atau password salah" });
      return;
    }

    // Get account with password
    const [account] = await db
      .select()
      .from(accounts)
      .where(eq(accounts.userId, user.id))
      .limit(1);

    if (!account || !account.password) {
      res.status(401).json({ error: "Email atau password salah" });
      return;
    }

    // Verify password
    const isValid = await bcrypt.compare(data.password, account.password);
    if (!isValid) {
      res.status(401).json({ error: "Email atau password salah" });
      return;
    }

    // Generate token
    const token = generateToken(user.id, user.email);

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
      token,
    });
  })
);

/**
 * GET /api/auth/me
 * Get current user from token
 */
router.get(
  "/me",
  asyncHandler(async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ error: "Token tidak ditemukan" });
      return;
    }

    const token = authHeader.split(" ")[1];

    try {
      const payload = verifyToken(token);

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, payload.userId))
        .limit(1);

      if (!user) {
        res.status(401).json({ error: "Pengguna tidak ditemukan" });
        return;
      }

      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
      });
    } catch (error) {
      res.status(401).json({ error: "Token tidak valid atau sudah kadaluarsa" });
    }
  })
);

export default router;
