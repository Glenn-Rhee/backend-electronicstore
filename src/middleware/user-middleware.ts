  import { NextFunction, Response } from "express";
import { Jwt, Payload } from "../lib/jwt";
import { ResponseError } from "../error/response-error";
import { RequestUser } from "../types/main";
import { Cookie } from "../lib/cookie";

export default function userMiddleware(
  req: RequestUser,
  _res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization;
  if (!token || "") {
    throw new ResponseError(403, "Forbidden! Token is requried");
  }

  let dataToken: Payload;
  try {
    dataToken = Jwt.verify(token);
  } catch (error) {
    throw new ResponseError(403, "Forbidden! Unathorize, Login first!");
  }

  const checkExp = Jwt.checkExp(dataToken.exp!);
  if (!checkExp) {
    throw new ResponseError(403, "Your session has expired, please login!");
  }

  req.idUser = dataToken.id;
  Cookie.updateCookie(_res, token);

  next();
}
