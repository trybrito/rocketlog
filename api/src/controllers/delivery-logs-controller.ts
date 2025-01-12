import { Request, Response } from "express";
import { AppError } from "@/errors/AppError";
import { prisma } from "@/database/prisma";
import { z } from "zod";

class DeliveryLogsController {
  async show(request: Request, response: Response) {
    const paramsSchema = z.object({
      delivery_id: z.string().uuid(),
    });

    const { delivery_id } = paramsSchema.parse(request.params);

    const delivery = await prisma.delivery.findUnique({
      where: { id: delivery_id },
      include: {
        logs: true,
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    if (!delivery) {
      throw new AppError("Delivery not found");
    }

    if (
      request.user?.role === "costumer" &&
      request.user?.id !== delivery.userId
    ) {
      throw new AppError("Users can only visualize their own deliveries", 401);
    }

    return response.json(delivery);
  }
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      delivery_id: z.string().uuid(),
      description: z.string(),
    });

    const { delivery_id, description } = bodySchema.parse(request.body);

    const delivery = await prisma.delivery.findUnique({
      where: { id: delivery_id },
    });

    if (!delivery) {
      throw new AppError("Delivery not found");
    }

    if (delivery.status === "delivered") {
      throw new AppError("This order has already been delivered");
    }

    if (delivery.status === "processing") {
      throw new AppError(
        "Change delivery status to shipped to register a delivery log"
      );
    }

    await prisma.deliveryLog.create({
      data: { deliveryId: delivery_id, description },
    });

    return response.status(201).json();
  }
}

export { DeliveryLogsController };
