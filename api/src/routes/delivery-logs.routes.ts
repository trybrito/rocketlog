import { Router } from "express";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";
import { DeliveryLogsController } from "@/controllers/delivery-logs-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";

const deliveryLogsRoutes = Router();
const deliveryLogsController = new DeliveryLogsController();

deliveryLogsRoutes.use(ensureAuthenticated);
deliveryLogsRoutes.post(
  "/",
  verifyUserAuthorization(["seller"]),
  deliveryLogsController.create
);
deliveryLogsRoutes.get(
  "/:delivery_id/show",
  verifyUserAuthorization(["seller", "costumer"]),
  deliveryLogsController.show
);

export { deliveryLogsRoutes };
