//Vamos a recibir como parámetro los roles que pueden accederal a un servicio
const authorizationMiddleware = (rols) => {
  return (req, res, next) => {
    //Debemos obtener el rol del usuario qie está haciendo el request
    const userRole = req.user.role;
    console.log(userRole);
    //Verificar si el rol del usuario que está haciendo el request tienen permitido acceder al servicio
    if (!rols.includes(userRole)) {
      return res.status(403).json({ message: "Acces denied" });
    }
    next();
  };
};

export default authorizationMiddleware;
