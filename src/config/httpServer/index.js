const http = require('http');
const app = require('../../app');
const env = require('../env');
const logger = require('../../util/logger');

const server = http.createServer(app);

const startServer = () => {
  const port = env.PORT;
  const handleListen = () => {
    return logger.info(`API http server listening at port: ${port}`);
  }
  const serverRef = server.listen(port, handleListen);
  return serverRef;
}

const stopServer = (args) => {
  server.close(args);
  logger.info('API http server closed');
}

module.exports = { startServer, stopServer };