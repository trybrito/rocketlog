import { Request, Response } from "express";
import { AppError } from "@/errors/AppError";
import { prisma } from "@/database/prisma";
import { hash } from "bcrypt";
import { z } from "zod";

class UsersController {
  async index(request: Request, response: Response) {
    return response.json();
  }
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(1),
      email: z.string().email(),
      password: z.string().trim().min(6),
    });

    const { name, email, password } = bodySchema.parse(request.body);
    const userWithSameEmailAlreadyExists = await prisma.user.findFirst({
      where: { email },
    });

    if (userWithSameEmailAlreadyExists) {
      throw new AppError("User with same email already exists");
    }

    const hashedPassword = await hash(password, 8);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return response.status(201).json(userWithoutPassword);
  }
}

export { UsersController };
