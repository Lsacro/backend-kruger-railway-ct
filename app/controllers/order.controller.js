import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Comment } from "../models/comment.model.js";

const createOrder = async (req, res) => {
  try {
    //Para crear la orden primero necesitamos calcular el total de la orden
    const { products, userId, comments } = req.body;
    //productos = [{id: 1, quantity: 2}, {id: 2, quantity: 3}]
    let totalPrice = 0;

    const productPromises = products.map(async (item) => {
      const products = await Product.findById(item.product);
      if (!products) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
      totalPrice += products.price * item.quantity;
      return products;
    });

    await Promise.all(productPromises);

    //Crear la orden
    const order = new Order({
      user: userId,
      products,
      comments,
      totalPrice,
    });
    await order.save();

    res.status(201).json({ message: "Order creada exitosamente", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.id })
      .populate("products.product")
      .populate("user")
      .populate("comments")
      .exec();
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addCommentToOrder = async (req, res) => {
  try {
    //Primero vamos a obtener el id de la orden de nuestro path param
    const { orderId } = req.params;
    //Luego necesitamos saber el id del usuario que está haciendo el comentario y necesitamos el mensaje o comentario que escribió el usuario
    //Esto lo vamos a obtener del cuerpo de la petición -> req.body
    const { userId, message } = req.body;
    //Vamos a crear el comment en nuestra BDD
    const comment = new Comment({
      user: userId,
      message,
    });

    await comment.save();

    //Vamos a relacionar el comentario con la orden
    //Primero necesito buscar la orden con el Id que recibimos en el path param
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    //comments: ["id comentario 1", "id comentario 2"]

    //Vamos a asociar el comentario que anteriormente insertamos en la BDD a la orden que acabamos de encontrar
    order.comments.push(comment._id);

    //Vamos a guardar la orden con el nuevo comentario en nuestra BDD
    await order.save();

    res.status(201).json({ message: "Comentario agregado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createOrder, getOrdersByUser, addCommentToOrder };
