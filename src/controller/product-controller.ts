import { NextFunction, Response } from "express";
import { RequestUser } from "../types/main";
import ProductService from "../services/product-service";
import { CreateProduct } from "../model/product-model";
import { Validation } from "../validation/Validation";
import ProductValidation from "../validation/product-validation";
import { Product, Tags } from "@prisma/client";

export default class ProductController {
  static async getProducts(
    req: RequestUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const idProduct = req.query.id as string | undefined;
      const orderBy = req.query.orderBy as string | undefined;
      const asc = req.query.asc as string | undefined;
      const response = await ProductService.getProducts(
        req.idUser,
        idProduct,
        orderBy,
        asc
      );
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

  static async updateProduct(
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

      const idProduct = req.query.id as string | undefined;
      const idTag = req.query.idTag as string | undefined;

      const response = await ProductService.updateProduct<Product & Tags, null>(
        req.idUser,
        data,
        { idProduct, idTag }
      );

      res.status(response.statusCode).json(response.data);
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(
    req: RequestUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const idProduct = req.query.id as string | undefined;

      const response = await ProductService.deleteProduct(
        req.idUser,
        idProduct
      );

      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getProduct(req: RequestUser, res: Response, next: NextFunction) {
    try {
      const searchQuery = req.query.search as string | undefined;

      const response = await ProductService.getProduct(req.idUser, searchQuery);

      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
}
