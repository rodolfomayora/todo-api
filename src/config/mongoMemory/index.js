const mongoose = require('mongoose');
const mongoMemoryServer = require('../mongoMemoryServer');
const logger = require('../../util/logger');

let mongo = null;

const openConnection = async () => {
  try {
    const { uri, config } = await mongoMemoryServer.startServer();
    mongo = await mongoose.connect(uri, config);
    const databaseName = mongo.connection.name;
    logger.info('Local mongoDB connection opened');
    logger.info(`Local DB connected: ${databaseName}`);

  } catch (error) {
    logger.error(error);
  }
}

const closeConnection = async () => {
  try {
    await mongo.connection.close();
    logger.info('Local mongoDB connection closed');
    await mongoMemoryServer.stopServer();

  } catch (error) {
    logger.error(error);
  }
}

const dropCollections = async () => {
  const collections = await mongo.connection.db.collections();
  for (const collection of collections) await collection.drop();
  logger.info('Local mongoDB collections droped');
}

module.exports = {
  openConnection,
  closeConnection,
  dropCollections
}