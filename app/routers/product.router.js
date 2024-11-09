import express from "express";
import {
  getAllProducts,
  saveProduct,
  updateProduct,
  getProductById,
  deleteProduct,
  findProductsByFilters,
  getProductsStatistics,
} from "../controllers/product.controller.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import authorizationMiddleware from "../middlewares/authorization.middleware.js";

const router = express.Router();

router.use(authenticationMiddleware);

//Vamos a definir que rol puede acceder a cada uno de los servicios
router.get(
  "/by-filters",
  authorizationMiddleware(["admin", "author", "user"]),
  findProductsByFilters
); //Acceso para todos
router.get("/", authorizationMiddleware(["admin", "author"]), getAllProducts); //Acceso para todos
router.post("/", authorizationMiddleware(["admin", "author"]), saveProduct); //Acceso solo para adminin y author
router.put("/:id", authorizationMiddleware(["admin", "author"]), updateProduct); //Acceso solo para adminin y author
router.patch(
  "/:id",
  authorizationMiddleware(["admin", "author", "user"]),
  getProductById
); // Acceso para todos
router.delete("/:id", authorizationMiddleware(["admin"]), deleteProduct); // Acceso para admin
router.get(
  "/statistics",
  authorizationMiddleware(["admin", "author", "user"]),
  getProductsStatistics
); // Acceso para todos

export default router;
