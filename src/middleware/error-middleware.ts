import { NextFunction, Request, Response } from "express";
import { responseUser } from "../types/main";
import { ZodError } from "zod";
import { ResponseError } from "../error/response-error";

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
    const response = responseUser({
      message: "Bad Request",
      status: "failed",
      statusCode: 400,
      error,
    });

    res.status(400).json(response);
  } else if (error instanceof ResponseError) {
    const response = responseUser({
      message: error.message,
      status: "failed",
      statusCode: error.status,
    });

    res.status(error.status).json(response);
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
