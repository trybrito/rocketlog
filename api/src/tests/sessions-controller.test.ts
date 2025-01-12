import { prisma } from "@/database/prisma";
import request from "supertest";
import { app } from "@/app";

describe("SessionsController", () => {
  let user_id: string;

  afterAll(async () => {
    await prisma.user.delete({ where: { id: user_id } });
  });

  it("should authenticate and get access token", async () => {
    const userResponse = await request(app).post("/users").send({
      name: "Jhon Doe",
      email: "jhondoe@example.com",
      password: "password",
    });

    user_id = userResponse.body.id;

    const sessionResponse = await request(app).post("/sessions").send({
      email: "jhondoe@example.com",
      password: "password",
    });

    expect(sessionResponse.status).toBe(200);
    expect(sessionResponse.body.token).toEqual(expect.any(String));
  });
});
