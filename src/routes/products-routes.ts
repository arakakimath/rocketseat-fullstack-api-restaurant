import { ProductController } from "@/controllers/products-controller";
import { Router } from "express";

const productsRoutes = Router();
const productsController = new ProductController();

productsRoutes.get("/", (request, response, next) => {
  productsController.index(request, response, next)
});
productsRoutes.post("/", (request, response, next) => {
  productsController.create(request, response, next)
});
productsRoutes.put("/:id", (request, response, next) => {
  productsController.update(request, response, next)
});
productsRoutes.delete("/:id", (request, response, next) => {
  productsController.delete(request, response, next) 
});

export { productsRoutes };
