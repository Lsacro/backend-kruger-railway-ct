import winston from "winston";
import "winston-daily-rotate-file";

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  //template sting
  //Vamos a reemplazar
  //por esto "2021-10-05" [ERORR]: Hola mundo esto es un error
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  },

  colors: {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    verbose: "cyan",
    debug: "white",
    silly: "gray",
  },
};

const fileTransport = new winston.transports.DailyRotateFile({
  dirname: "./logs",
  filename: "application-%DATE%.log", //application-2021-10-25.log, día de mañana 2021-10-26.log
  datePattern: "YYYY-MM-DD-HH-mm",
  //Vamos a definir una politica de retención de archivos
  //Vamos a comprimir los archivos que ya no se estén utilizando
  zippedArchive: true,
  //Vamos a definir el tamaño máximo de nuestros archivos
  maxSize: "1m",
  //Vamos a definir el número máximo de archivos que vaoms a tner disponibles, una ves que lleguemos a este número
  //automáticamente se va a borrar los archivos mas viejos

  maxFiles: "1",
  //Vamos a definir la frecuencia en tiempo que queremos segmentar nuestros logs
  frequency: "1m",
  level: "debug",
});
//Vamos a crear nuestro logged
//Para esto tenemos que definir un trasporte

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    logFormat
  ),

  transports: [
    new winston.transports.Console({
      level: "silly",
      format: winston.format.combine(
        winston.format.colorize({ all: true, colors: customLevels.colors })
      ),
    }),

    fileTransport,
  ],
});

//Cómo registrar los eventos en consola
//logger.error("Hola mundo esto es un error")
//logger.warn("Hola mundo esto es un warn")
//logger.info("Hola mundo conlogged")
//logger.http("Hola mundo esto es un http")
//logger.verbose("Hola mundo esto es un verbose")
//logger.debug("Hola mundo esto es un debug")
//logger.silly("Hola mundo esto es un silly")

export default logger;
