import { NextFunction, Response } from "express";
import { RequestUser } from "../types/main";
import StoreService from "../services/store-service";

export default class StoreController {
  static async getStoreInfo(
    req: RequestUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await StoreService.getStoreInfo(req.idUser);

      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
}
