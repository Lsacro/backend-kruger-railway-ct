//1. DEfinir el schema de los atributos de los documentos, los tipos de datos y validaciones
//2. Crear el modelo (clase) del producto

import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  //validación simple solo el valor, más validaciones pasamos un bojeto {}
  title: {
    type: String,
    required: [true, "A product must have a tittle"],
    unique: true,
  },
  description: {
    type: String,
    minlength: [
      5,
      "A product must have a description with at least 5 characters",
    ],
    maxlength: [
      100,
      "A product must have a description with at most 50 characters",
    ],
  },
  price: {
    type: Number,
    required: [true, "A product must have a price"],
    min: [0, "A product must have a price greater than or equal to 0"],
    max: [5000, "A product must have a price less than or equal to 1000"],
  },
  category: {
    type: String,
    required: [true, "A product must have a category"],
  },
});

export const Product = mongoose.model("products", productSchema);
