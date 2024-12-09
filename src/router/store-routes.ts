import express from "express";
import StoreController from "../controller/store-controller";

export const storeRoutes = express.Router();

storeRoutes.get("/store", StoreController.getStoreInfo)
storeRoutes.post("/store", StoreController.setStore)