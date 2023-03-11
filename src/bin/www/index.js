const httpServer = require('../../config/httpServer');
const mongoDB = require('../../config/mongoDB');

const main = async () => {
  const endOperations = async () => {
    await mongoDB.closeConnection();
    httpServer.stopServer();
    process.exit(0);
  }

  httpServer.startServer();

  await mongoDB.openConnection();

  process.on('SIGUSR2', endOperations); // for development (nodemon restart)

  process.on('SIGINT', endOperations); // for development

  process.on('SIGTERM', endOperations); // for production
}

main();