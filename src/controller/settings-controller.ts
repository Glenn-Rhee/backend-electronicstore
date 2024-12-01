import { NextFunction, Response } from "express";
import { RequestUser } from "../types/main";
import SettingsService from "../services/settings-service";

export default class SettingsController {
  static async getSettingsUser(
    req: RequestUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await SettingsService.getSettingsUser(req.idUser);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
}
