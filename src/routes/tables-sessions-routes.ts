import { Router } from "express";

import { tablesSessionsController } from "@/controllers/tables-sessions-controller";

export const tablesSessionsRoutes = Router()

tablesSessionsRoutes.post("/", tablesSessionsController.open)
tablesSessionsRoutes.get("/", tablesSessionsController.index)
tablesSessionsRoutes.patch("/:id", tablesSessionsController.close)

