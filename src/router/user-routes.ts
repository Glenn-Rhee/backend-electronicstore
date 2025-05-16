import express from "express";
import { UserController } from "../controller/user-controller";

export const userRoutes = express.Router();

userRoutes.get("/user", UserController.getUser);
userRoutes.get("/user/order", UserController.getUserOrder);
userRoutes.get("/user/products", UserController.getProducts);
