import express from "express";
import {
  createOrder,
  getOrdersByUser,
  addCommentToOrder,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", createOrder);
//Servicio para obtener el listado de ordenes por userId
router.get("/:id", getOrdersByUser);
//Servicio para agregar comentarios a una orden
//Primero necesito la orden a la cual vamos a agragar los comentarios -> id de la orden
//Que vamos a recibir un path param
router.post("/:orderId/comment", addCommentToOrder);

export default router;
