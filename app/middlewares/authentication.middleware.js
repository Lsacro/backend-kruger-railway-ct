import jwt from "jsonwebtoken";
import configs from "../configs/configs.js";

const authenticationMiddleware = (req, res, next) => {
  //Vamos a obtener el JWT del header del request
  const authHeader = req.header("Authorization");
  //Vamos a validar si esta llegando o mo el JWT en el header y adicionalmente que el header empiece con la palabra bearer

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  //Vamos a validar nuestro archivo the JWT
  try {
    // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC... --> token
    const token = authHeader.split(" ")[1]; //Split ["Bearer","token"]
    //Vamos a validar y decodificar el token
    const decoder = jwt.verify(token, configs.JWT_SECRET);
    //Modificar o agregar un atributo en el request
    req.user = decoder;
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
  next();
};

export default authenticationMiddleware;
