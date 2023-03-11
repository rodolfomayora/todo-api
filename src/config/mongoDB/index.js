const mongoose = require('mongoose');
const logger = require('../../util/logger');
const env = require('../env');

let mongo = null;

const openConnection = async () => {
  try {
    const uri = env.MONGO_URI;
    const config = {
      useNewUrlParser: true,
      user: env.MONGO_USER,
      pass: env.MONGO_PASSWORD,
      dbName: env.MONGO_DBNAME
    }

    mongo = await mongoose.connect(uri, config);
    const databaseName = mongo.connection.name;
    logger.info('MongoDB connection opened');
    logger.info(`DB connected: ${databaseName}`);

  } catch (error) {
    logger.error(error);
  }
}

const closeConnection = async () => {
  try {
    await mongo.connection.close()
    logger.info('MongoDB connection closed');
    
  } catch (error) {
    logger.error(error);
  }
}

module.exports = {
  openConnection,
  closeConnection
}