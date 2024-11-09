import logger from "../utils/logger.js";

const testLogs = async (req, res) => {
  try {
    logger.error("Hola mundo esto es un error");
    logger.warn("Hola mundo esto es un warn");
    logger.info("Hola mundo esto es un info");
    logger.http("Hola mundo esto es un http");
    logger.verbose("Hola mundo esto es un verbose");
    logger.debug("Hola mundo esto es un debug");
    logger.silly("Hola mundo esto es un silly");
    res.send("Logs ok");
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export default testLogs;
