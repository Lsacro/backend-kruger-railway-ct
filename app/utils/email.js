import nodemailer from "nodemailer";
import configs from "../configs/configs.js";

//En las options vamos a recivir el email donde vamos a enviar el corre
//Vamos a recivir el asunto del correo
//Vamos a recibir el mensaje del correo
//Options es un objeto que tiene las propiedades de email, asunto y mensaje

const sendEmail = async (options) => {
  //Vamos a crear la integracion con el sercio de mailtrap usando nodemailer
  console.log(configs);
  const transporter = nodemailer.createTransport({
    host: "live.smtp.mailtrap.io",
    port: 2525,
    auth: { user: configs.MAILTRAP_USER, pass: configs.MAILTRAP_PASS },
  });
  //Vamos a armar las opciones de envío de nuestro correo
  const mailOptions = {
    from: "'Kruger Backend' <no-reply@demomailtrap.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(mailOptions);
  return "Email enviado exitosamente";
};

export default sendEmail;
