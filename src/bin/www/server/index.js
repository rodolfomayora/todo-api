const http = require('http');
const app = require('../../../app');

const server = http.createServer(app);

const initServer = () => {
  const port = 3000;
  const initialCallback = () => {
    console.log(`API server listening at port: ${port}`);
  }
  const serverRef = server.listen(port, initialCallback);
  return serverRef;
}

const stopServer = (args) => {
  server.close(args);
  console.log('API server closed');
}

module.exports = { initServer, stopServer };