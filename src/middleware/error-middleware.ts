import { NextFunction, Request, Response } from "express";
import { responseUser } from "../types/main";
import { ZodError } from "zod";
import { ResponseError } from "../error/response-error";
import { JsonWebTokenError } from "jsonwebtoken";
import { Cookie } from "../lib/cookie";

export const notFound = (_r: Request, res: Response, _n: NextFunction) => {
  const response = responseUser({
    message: "Not Found!",
    status: "failed",
    statusCode: 404,
  });

  res.status(404).json(response);
};

export const errorMiddleware = (
  error: Error,
  _r: Request,
  res: Response,
  _n: NextFunction
) => {
  if (error instanceof ZodError) {
    console.log(error);
    const response = responseUser({
      message: "Bad Request",
      status: "failed",
      statusCode: 400,
      error: error.issues[0].message,
    });

    res.status(400).json(response);
  } else if (error instanceof ResponseError) {
    if (error.status === 403) {
      Cookie.removeCookie(res);
    }
    const response = responseUser({
      message: error.message,
      status: "failed",
      statusCode: error.status,
    });

    res.status(error.status).json(response);
  } else if (error instanceof JsonWebTokenError) {
    res.status(403).json({
      message: error.message.includes("signature")
        ? "Unathorized!"
        : error.message,
      status: "failed",
      statusCode: 403,
    });
  } else {
    console.log(error);
    const response = responseUser({
      message: "Internal server error",
      status: "failed",
      statusCode: 500,
    });

    res.status(500).json(response);
  }
};
