import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  //Objeto que representa el esquema de la orden
  /* 
        {
            user: "IdUser",
            products: [
            id : "IdProduct que estamos comprando",
            quantity: 2 Cantidad de productos que estoy comprando
            ],
            comments: [
                idComentraio: "IdComentraio",
            ],
            totalPrice: 200
        } 
    */
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users", //Debe ser igual  que en el model de cada entidad ejemplo en user.mode.js es "users", debe estra igual
    require: true,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment",
    },
  ],
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        require: true,
      },
      quantity: {
        type: Number,
        require: true,
        min: [1, "La cantidad debe ser mayor a 0"],
      },
    },
  ],
  totalPrice: {
    type: Number,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Order = mongoose.model("order", orderSchema);
