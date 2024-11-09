import moongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

const userSchema = new moongoose.Schema({
  userName: {
    type: String,
    required: [true],
    unique: [true],
  },
  password: {
    type: String,
    required: [true],
  },
  email: {
    type: String,
    required: [true],
    unique: [true],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ["admin", "user", "author"],
    default: "user",
  },
  resetPasswordToken: String, //para poder generar un identificador unico que vamos a enviar al usuario
  resetPasswordExpires: Date, //fecha de expiración del token
  deletedAt: {
    type: Date,
    default: null,
  },
});

//Vamos a aplicar un pre-hook (proceso que se va a ejecutar antes de almacenar el usuario en BDD)
//El primer parámetro de nuestro pre-hook es la operación a la cual vamos a aplicar el hook
userSchema.pre("save", async function (next) {
  //Siempre definir la función como función no función flecha
  const user = this; //this -->  es el objeto que estamos guardando en BDD
  //Solo si se está modificando el atributo password vamos a hashear la contraseña
  if (user.isModified("password")) {
    try {
      //Primer paso para hashear la contraseña, es generar un salt (va ha ser generado de manera aleatoria)
      const salt = await bcrypt.genSalt(10);

      //Segundo paso, es hashear la constraseña
      //1234 -> $as73te%fddYdg53
      const hash = await bcrypt.hash(user.password, salt);

      //Tercer paso es asignar la contraseña hasheada al atributo password
      user.password = hash;

      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

//Vamos a crear un hook que se encargue de eliminar la contraseña del objeto que se va a devolver al cliente
userSchema.post("find", async function (docs, next) {
  docs.forEach((doc) => {
    doc.password = undefined;
    next();
  });
});

//Vamos a extender la funcionalidad de nuestro shema, de manera que tenfa un meteodo que nos permita
//Compara la contraseña que el usuario esta enviando con la contraseña
//recibe el parametro password  que envía  el cliente para autenticarse

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generatePasswordToken = function () {
  //Generamos la cadena randomica en formato hexadecimal
  const resetToke = crypto.randomBytes(20).toString("hex");
  //Vamos a guardar el token hasheado
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToke)
    .digest("hex");
  //Vamos a definir el tiempo de expiración de nuestro token y vamos a settearlo (1 hora)
  this.resetPasswordExpires = Date.now() + 3600000;
  return resetToke;
};

export const User = moongoose.model("users", userSchema);
