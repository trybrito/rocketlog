import { prisma } from "@/database/prisma";
import request from "supertest";
import { app } from "@/app";

describe("UserController", () => {
  let user_id: string;

  afterAll(async () => {
    await prisma.user.delete({
      where: {
        id: user_id,
      },
    });
  });

  it("should create a new user successfully", async () => {
    const response = await request(app).post("/users").send({
      name: "Jhon Doe",
      email: "jhondoe@example.com",
      password: "password",
    });

    user_id = response.body.id;

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("Jhon Doe");
  });

  it("should throw an error if an user with the same email already exists", async () => {
    const response = await request(app).post("/users").send({
      name: "Jhon Doe",
      email: "jhondoe@example.com",
      password: "password",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User with same email already exists");
  });

  it("should throw a validation error if email is invalid", async () => {
    const response = await request(app).post("/users").send({
      name: "Jhon Doe",
      email: "invalid email",
      password: "password",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation error");
  });
});
