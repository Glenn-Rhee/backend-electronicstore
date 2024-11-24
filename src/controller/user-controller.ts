import { NextFunction, Request, Response } from "express";
import { CreateUserRequest } from "../model/user-model";
import { UserService } from "../services/user-service";

export class UserController {
  static async getUser(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (error) {}
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const reqBody: CreateUserRequest = req.body as CreateUserRequest;
      const { from } = req.query;
      const response = await UserService.register<
        { id: string; token: string },
        null  
      >(reqBody, from as "dashboard" | "store" | undefined);

      res.send(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
}
