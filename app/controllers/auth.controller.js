import configs from "../configs/configs.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/email.js";
import crypto from "crypto";

const register = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    //1.- Vamos a obtener las credenciales (userName, password) del request
    const { userName, password } = req.body;
    //2.- Vamos a buscar el usuario en BDD, so nomexiste vamos a retornar un 404
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    //3.- Vaoms a comparar la constraseña que viene en el request con la contraseña hasheada en la BDD
    const passwordMatch = await user.comparePassword(password);
    //4.- Si las contraseñas no cinciden, vamos a retornar un 401
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    //5.- Si las contraseñas coidicen, vamos a generar un token JWT y vamos a retornar en la respuesta
    //El metodo sign lo que hace es firmar nuestro jwt (token)
    //El primer parámetro que vamos a enviar en el método es un objeto que contiene la información del usuario

    const token = await jwt.sign(
      { user_id: user._id, role: user.role },
      configs.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    //1. Vamos a validar el correo que está enviando existe  o está almacenado en BDD
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } //2. Vamos a generar un token único que vamos a enviar al usuario
    const resetToken = user.generatePasswordToken();
    await user.save({ validateBeforeSave: false });
    //3. Vamos a generar la URL que vamos a enviar al correo de usuario
    //http://localhost:5173/reset-password/$resetToken
    const resetURL = `http://localhost:5173/reset-password/${resetToken}`;
    try {
      const message = `to reset your password, click on this link: ${resetURL}`;

      await sendEmail({
        email: user.email,
        subject: "Reset Password",
        message,
      });
      res.json({ message: "Email sent" });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    //1. Vamos a obtener el token de request
    const { token } = req.params;
    //2. Vamos a obtener la nueva password que ha configurado el usuario
    const { password } = req.body;
    //3. En BDD tenemos el token pero está hasheado y lo que llega en el request está en el texto plano
    //Vamos a hashear el token que llega en el reques para poder compararlo en la base de datos
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    //4. Vamos a buscar ese usuario de acuerdo al token hasheado y además vamos a aplicar una condición de tiempo de vida del token
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });
    //5. Validar si el usuario que estamos buscando existe o no
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid token or expired token" });
    }
    //6. Vamos a cambiar la constraseña del usuario
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export { register, login, forgotPassword, resetPassword };
