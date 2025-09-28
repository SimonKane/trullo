import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req?.headers?.authorization || "";

    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res
        .status(401)
        .json({ message: "Unauthorized", error: "Invalid or missing header" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing");
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;

    (req as any).userId = payload.sub;
    (req as any).role = payload.role;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized", error: "Invalid or expired token" });
  }
}
