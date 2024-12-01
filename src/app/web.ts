import express from "express";
import { authRoutes } from "../router/auth-routes";
import cors from "cors";
import { errorMiddleware, notFound } from "../middleware/error-middleware";
import cookieParser from "cookie-parser";
import userMiddleware from "../middleware/user-middleware";
import { transactionRoutes } from "../router/transaction-routes";
export const app = express();
const PORT = 3001;

app.use(
  cors({
    origin: "http://localhost:3000",
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
app.use(transactionRoutes);

app.use(notFound);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
