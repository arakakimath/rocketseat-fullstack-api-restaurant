import { Router } from "express";

import { tablesController } from "@/controllers/tables-controller";

const tablesRoutes = Router()

tablesRoutes.get("/", (request, response, next) => {
  tablesController.index(request, response, next) 
});

export { tablesRoutes }