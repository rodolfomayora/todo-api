const httpServer = require('../../config/httpServer');
const mongoDB = require('../../config/mongoDB');

const init = async () => {
  // 1) server config
  httpServer.startServer();

  // 2) data base config
  await mongoDB.openConnection();

  process.on('SIGINT', async () => { // for development
    await mongoDB.closeConnection();
    httpServer.stopServer();
    process.exit(0);
  });

  process.on('SIGTERM', async () => { // for production
    await mongoDB.closeConnection();
    httpServer.stopServer();
    process.exit(0);
  });
}

init();