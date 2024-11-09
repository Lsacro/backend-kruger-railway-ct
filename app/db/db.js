import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://Lsacro:Admin1234@krugercarlos.a5ypf.mongodb.net/products?retryWrites=true&w=majority&appName=KrugerCarlos"
    );
    console.log("Conección a la base de datos exitosa");
  } catch (error) {
    console.error("Error al conectar a la base de datos", error);
  }
};
