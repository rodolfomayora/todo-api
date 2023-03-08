const http = require('http');
const app = require('../../../app');
const config = require('../../../config');
const logger = require('../../../utils/logger');

const server = http.createServer(app);

const initServer = () => {
  const port = config.PORT;
  const initialCallback = () => {
    logger.info(`API server listening at port: ${port}`);
  }
  const serverRef = server.listen(port, initialCallback);
  return serverRef;
}

const stopServer = (args) => {
  server.close(args);
  logger.info('API server closed');
}

module.exports = { initServer, stopServer };