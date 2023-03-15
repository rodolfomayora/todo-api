const httpServer = require('../../config/httpServer');
const database = require('../../config/database');
const env = require('../../config/env');

const main = async () => {
  const endOperations = async () => {
    await database.closeConnection();
    httpServer.stopServer();
    process.exit(0);
  }

  httpServer.startServer();

  await database.openConnection();

  if (env.IS_DEVELOPMENT) require('../../util/createDummyDocuments')();

  process.on('SIGUSR2', endOperations); // for development (nodemon restart)

  process.on('SIGINT', endOperations); // for development

  process.on('SIGTERM', endOperations); // for production
}

main();