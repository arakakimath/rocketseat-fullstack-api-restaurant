import { Request, Response, NextFunction } from "express";
import { z } from "zod"
import { knex } from "@/database/knex";
import { table } from "console";

export class OrdersController {
  create = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const bodySchema = z.object({
          table_session_id: z.number(),
          product_id: z.number(),
          quantity: z.number()
      })

      const { table_session_id, product_id, quantity } = bodySchema.parse(request.body)

      const session = await knex<TablesSessionsRepository>("tables_sessions")
        .where({ id: table_session_id }).first()

      if (!session) 
        throw new AppError("session table not found")
      if (session.closed_at)
        throw new AppError("this table is closed")

      const product = await knex<ProductRepository>("products")
        .where({ id: product_id }).first()

      if (!product)
        throw new AppError("product not found")
      
      await knex<OrdersRepository>("orders").insert({
        table_session_id,
        product_id,
        quantity,
        price: product.price
      })

      return response.status(201).json()
    }
    catch(error) {
      next(error)
    }
  }

  index = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const table_session_id = request.params.id
      
      const order = await knex<OrdersRepository>("orders")
        .select(
          "orders.id", 
          "orders.table_session_id", 
          "orders.product_id",
          "products.name",
          "orders.price",
          "orders.quantity",
          knex.raw("(orders.price * orders.quantity) AS total"),
          "orders.created_at",
          "orders.updated_at"
        )
        .join("products", "products.id", "orders.product_id")
        .where({ table_session_id })
        .orderBy("orders.created_at")
      return response.json()
    }
    catch(error) {
      next(error)
    }
  }

  show = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const table_session_id = request.params.id

      const order = await knex("orders")
        .select("COALESCE(SUM(orders.price * orders*quantity), 0) AS total") //try to do the sum, if can't result is 0
        .where({ table_session_id }).first()

      return response.json()
    }
    catch(error) {

    }
  }
}