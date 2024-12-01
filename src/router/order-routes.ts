import express from "express";
import OrderController from "../controller/order-controller";

export const orderRoutes = express.Router();

orderRoutes.get("/order", OrderController.getOrder);
