import express from "express";
import { authRoutes } from "../router/auth-routes";
import cors from "cors";
import { errorMiddleware, notFound } from "../middleware/error-middleware";
import cookieParser from "cookie-parser";
import userMiddleware from "../middleware/user-middleware";
import { transactionRoutes } from "../router/transaction-routes";
import { userRoutes } from "../router/user-routes";
import { orderRoutes } from "../router/order-routes";
import { productRoutes } from "../router/product-routes";
import { settingsRoutes } from "../router/settings-routes";
import { storeRoutes } from "../router/store-routes";
export const app = express();
const PORT = 8001;

app.use(
  cors({
    origin: ["http://localhost:3001", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(authRoutes);

app.use(userMiddleware);
app.use(userRoutes);
app.use(transactionRoutes);
app.use(orderRoutes);
app.use(productRoutes);
app.use(settingsRoutes);
app.use(storeRoutes);

app.use(notFound);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
