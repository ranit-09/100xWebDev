import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthedRequest extends Request {
  userId?: string;
}

export function signToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

export function authMiddleware(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers["authorization"];
  const token = header?.startsWith("Bearer ") ? header.slice(7) : header;

  if (!token) {
    res.status(401).json({ message: "missing auth token" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: "invalid or expired token" });
  }
}
