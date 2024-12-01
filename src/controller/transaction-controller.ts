import { NextFunction, Response } from "express";
import TransactionService from "../services/transaction-service";
import { RequestUser } from "../types/main";

export default class TransactionController {
  static async getTransaction(
    req: RequestUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await TransactionService.getTransaction(req.idUser);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
}
