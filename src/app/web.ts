import express from "express";
import { authRoutes } from "../router/auth-routes";
import { errorMiddleware, notFound } from "../middleware/error-middleware";
export const app = express();
const PORT = 3001;

app.use(express.json());
app.use(authRoutes);

app.use(notFound);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
