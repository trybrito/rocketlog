import { Request, Response } from "express";

class UsersController {
  async index(request: Request, response: Response) {
    return response.json();
  }
  async create(request: Request, response: Response) {
    return response.status(201).json();
  }
}

export { UsersController };
