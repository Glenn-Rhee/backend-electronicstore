import { NextFunction, Response } from "express";
import { RequestUser } from "../types/main";
import ProductService from "../services/product-service";
import { CreateProduct } from "../model/product-model";
import { Validation } from "../validation/Validation";
import ProductValidation from "../validation/product-validation";
import { Product } from "@prisma/client";

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

  static async createProduct(
    req: RequestUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const dataBody = req.body as CreateProduct;
      const data = Validation.validate(
        ProductValidation.CREATEPRODUCT,
        dataBody
      );
      const response = await ProductService.createProduct<Product, null>(
        req.idUser,
        data
      );

      res.status(response.statusCode).json(response.data);
    } catch (error) {
      next(error);
    }
  }
}
