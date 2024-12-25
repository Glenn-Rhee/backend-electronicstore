import { NextFunction, Response } from "express";
import { RequestUser } from "../types/main";
import SettingsService from "../services/settings-service";
import { SetSettingsUser } from "../model/setting-model";
import { Validation } from "../validation/Validation";
import SettingsValidation from "../validation/settings-validation";

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

  static async setSettingsUser(
    req: RequestUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = req.body as SetSettingsUser;
      const settingsData = Validation.validate(
        SettingsValidation.SETSETTINGS,
        data
      );

      const response = await SettingsService.setSettingsUser<
        SetSettingsUser,
        null
      >(req.idUser, settingsData);

      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
}
