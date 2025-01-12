import { Request, Response, NextFunction } from "express";
import { AppError } from "@/errors/AppError";
import { authConfig } from "@/configs/auth";
import { verify } from "jsonwebtoken";

interface ITokenPayload {
  role: string;
  sub: string;
}

function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new AppError("JWT token not found");
    }

    const [, token] = authHeader.split(" ");

    const { role, sub: user_id } = verify(
      token,
      authConfig.jwt.secret
    ) as ITokenPayload;

    request.user = {
      id: user_id,
      role,
    };

    next();
  } catch (error) {
    throw new AppError("Invalid JWT token", 401);
  }
}

export { ensureAuthenticated };
