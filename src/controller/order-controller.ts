import { NextFunction, Response } from "express";
import { RequestUser } from "../types/main";
import OrderService from "../services/order-service";

export default class OrderController {
  static async getOrder(req: RequestUser, res: Response, next: NextFunction) {
    try {
      const response = await OrderService.getOrder(req.idUser);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
}
