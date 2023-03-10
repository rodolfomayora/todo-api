const http = require('http');
const app = require('../../app');
const env = require('../env');
const logger = require('../../util/logger');

let serverRef = null;

const startServer = () => {
  const server = http.createServer(app);
  const port = env.PORT;
  const handleListen = () => {
    return logger.info(`API http server listening at port: ${port}`);
  }
  serverRef = server.listen(port, handleListen);
  return serverRef;
}

const stopServer = (args) => {
  serverRef.close(args);
  serverRef = null;
  logger.info('API http server closed');
}

module.exports = { startServer, stopServer };