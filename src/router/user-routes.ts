import express from "express";
import { UserController } from "../controller/user-controller";

export const userRoutes = express.Router();

userRoutes.get("/user/order", UserController.getUserOrder);