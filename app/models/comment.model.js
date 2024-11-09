import mongoose from "mongoose";

const commmentSchema = new mongoose.Schema({
  //Comentraio estructurado
  /* 
    {
        user: "123455", 
        message: "hola mundo",
        createdAt: "2024-10-23 20:17:28"
    }
    */
  //De alguna manera debemos poder llegar a la información del usuario que hizo el comentario

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    require: true,
  },
  message: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Comment = mongoose.model("comment", commmentSchema);
