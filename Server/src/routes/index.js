import { Router } from "express";

import { trailsRouter } from "./trails.js";

export const routes = Router();

routes.use("/trails", trailsRouter);
