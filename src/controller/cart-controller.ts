import { NextFunction, Request, Response } from "express";
import { RequestUser } from "../types/main";
import { RequestBody } from "../model/cart-model";
import { Validation } from "../validation/Validation";
import { CartValidation } from "../validation/cart-validation";
import { CartService } from "../services/cart-service";

export class CartController {
  public static async CreateCart(
    req: RequestUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const idUser = req.idUser;
      const dataBody = req.body as RequestBody;

      const data = Validation.validate(CartValidation.CREATE, dataBody);

      const response = await CartService.createCart(idUser, data);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async GetCart(
    req: RequestUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const idUser = req.idUser;

      const response = await CartService.getCart(idUser);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
}
