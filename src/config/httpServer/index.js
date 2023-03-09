const http = require('http');
const app = require('../../app');
const env = require('../env');
const logger = require('../../util/logger');

const server = http.createServer(app);

const initServer = () => {
  const port = env.PORT;
  const initialCallback = () => {
    logger.info(`API http server listening at port: ${port}`);
  }
  const serverRef = server.listen(port, initialCallback);
  return serverRef;
}

const stopServer = (args) => {
  server.close(args);
  logger.info('API http server closed');
}

module.exports = { initServer, stopServer };