import express from "express";
import { connectDB } from "./db/db.js";
import productRoutes from "./routers/product.router.js";
import userRoutes from "./routers/user.router.js";
import configs from "./configs/configs.js";
import authRoutes from "./routers/auth.router.js";
import logsRoutes from "./routers/logs.router.js";
import orderRoutes from "./routers/order.router.js";
import cors from "cors";

const app = express();

//Middleware para parsear JSON
app.use(express.json());
app.use(cors());

connectDB();

app.use("/products", productRoutes); //productRoutes es un alias a export default
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/logs", logsRoutes);
app.use("/order", orderRoutes);

app.listen(configs.PORT, () => {
  console.log(`Servidor iniciado en el puerto ${configs.PORT}`);
});
