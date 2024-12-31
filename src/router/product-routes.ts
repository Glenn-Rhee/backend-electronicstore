import express from "express";
import ProductController from "../controller/product-controller";

export const productRoutes = express.Router();

productRoutes.get("/product", ProductController.getProducts);
productRoutes.post("/product", ProductController.createProduct)
productRoutes.put("/product", ProductController.updateProduct)
productRoutes.delete("/product", ProductController.deleteProduct)