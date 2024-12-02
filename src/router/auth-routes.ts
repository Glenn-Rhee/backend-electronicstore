import express from "express";
import { UserController } from "../controller/user-controller";

export const authRoutes = express.Router();

// User Router
authRoutes.delete("/user", UserController.logout);
authRoutes.post("/user/auth/signup", UserController.register);
authRoutes.post("/user/auth/login", UserController.login);
