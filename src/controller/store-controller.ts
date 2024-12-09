import { NextFunction, Response } from "express";
import { RequestUser } from "../types/main";
import StoreService from "../services/store-service";
import { SetStoreRequest } from "../model/store-model";
import { Validation } from "../validation/Validation";
import StoreValidation from "../validation/store-validation";

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

  static async setStore(req: RequestUser, res: Response, next: NextFunction) {
    try {
      const dataBody: SetStoreRequest = req.body as SetStoreRequest;
      const dataSet = Validation.validate(StoreValidation.SETSTORE, dataBody);
      const response = await StoreService.setStore(req.idUser, dataSet);

      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
}
