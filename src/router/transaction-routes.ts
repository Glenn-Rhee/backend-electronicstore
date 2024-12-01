import express from "express";
import TransactionController from "../controller/transaction-controller";
export const transactionRoutes = express.Router();

transactionRoutes.get("/transaction", TransactionController.getTransaction);
