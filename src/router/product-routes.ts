import express from "express";
import ProductController from "../controller/product-controller";

export const productRoutes = express.Router();

productRoutes.get("/product", ProductController.getProducts);
