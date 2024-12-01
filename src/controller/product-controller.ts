import { NextFunction, Response } from "express";
import { RequestUser } from "../types/main";
import ProductService from "../services/product-service";

export default class ProductController {
  static async getProducts(
    req: RequestUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await ProductService.getProducts(req.idUser);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
}
