import { NextFunction, Request, Response } from "express";
import { CreateUserRequest, LoginUserRequest } from "../model/user-model";
import { UserService } from "../services/user-service";
import { Cookie } from "../lib/cookie";

export class UserController {
  static async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.cookies["xtr"]);
      res.json({ message: "ok" });
    } catch (error) {
      next(error);
    }
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const reqBody: CreateUserRequest = req.body as CreateUserRequest;
      const token = req.headers.authorization;

      const { from } = req.query;
      const response = await UserService.register<
        { id: string; token: string },
        any
      >(reqBody, from as "dashboard" | "store" | undefined, token);
      Cookie.setCookie(res, response.data!.token);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const dataBody: LoginUserRequest = req.body as LoginUserRequest;

      const response = await UserService.login<
        { id: string; token: string },
        any
      >(dataBody, req.cookies.token);
      Cookie.setCookie(res, response.data!.token);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      Cookie.removeCookie(res);

      res.status(200).json({
        status: "success",
        message: "Sucessfully loged out",
        statusCode: 200,
      });
    } catch (error) {
      next(error);
    }
  }
}
