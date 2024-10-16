import { NextFunction, Request, Response } from "express";
import z from "zod";
import { knex } from "@/database/knex";
import { AppError } from "@/utils/AppError";

class ProductController {
  index = async (request: Request, response: Response, next: NextFunction) => {
    try {
      console.log(this)
      const { name } = request.query

      const products = await knex<ProductRepository>("products")
        .select()
        // select with query parameter if exists
        .whereLike("name", `%${name ?? ""}%`)

      return response.json(products)
    } catch (error) {
      next(error)
    }
  }

  create = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const bodySchema = z.object({
        name: z.string().trim().min(6),
        price: z.number().gte(0)
      })

      const { name, price } = bodySchema.parse(request.body)

      await knex<ProductRepository>("products").insert({ name, price })

      return response.status(201).json()
    } catch (error) {
      next(error)
    }
  }

  update = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const id = z
        .string()
        .transform((value) => Number(value))
        .refine((value) => !isNaN(value), {message: "id must be a number"})
        .parse(request.params.id)

      await this.#verifyId(id); // Verify if id exists

      const bodySchema = z.object({
        name: z.string().trim().min(6),
        price: z.number().gte(0)
      })

      const { name, price } = bodySchema.parse(request.body)

      await knex<ProductRepository>("products")
        .update({ name, price, updated_at: knex.fn.now() })
        .where({ id })

      return response.json("updated")
    } catch (error) {
      next(error)
    }
  }

  delete = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const id = z
        .string()
        .transform((value) => Number(value))
        .refine((value) => !isNaN(value), {message: "id must be a number"})
        .parse(request.params.id)

      await this.#verifyId(id); // Verify if id exists

      await knex<ProductRepository>("products")
        .delete()
        .where({ id })

      return response.json()
    } catch (error) {
      next(error)
    }
  }

  #verifyId = async (id) => {
    console.log(this)
    const product = await knex<ProductRepository>("products")
      .select()
      .where({ id })
      .first() // To product become an object instead of an array of objects

    if(!product) // Verify if there is a product with the id 
      throw new AppError("product not found")
  }
}

export { ProductController }