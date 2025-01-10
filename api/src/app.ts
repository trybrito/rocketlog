import express from "express";
import { routes } from "./routes";
import { errorHandler } from "@/middlewares/error-handler";

import "express-async-errors";

const app = express();

app.use(express.json());
app.use(routes);
app.use(errorHandler);

export { app };
