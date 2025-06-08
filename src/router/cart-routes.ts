import express from "express"
import { cartMiddleware } from "../middleware/user-middleware";
import { CartController } from "../controller/cart-controller";
export const cartRoutes = express.Router();

cartRoutes.post("/cart/user", cartMiddleware, CartController.CreateCart)
cartRoutes.get("/cart/user", cartMiddleware, CartController.GetCart)