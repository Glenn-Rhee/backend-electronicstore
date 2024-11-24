import express from "express";
import { UserController } from "../controller/user-controller";

export const authRoutes = express.Router();

// User Router
authRoutes.post("/user/auth/signup", UserController.register);
authRoutes.get("/user", UserController.getUser);
