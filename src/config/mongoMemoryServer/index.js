const { MongoMemoryServer } = require('mongodb-memory-server');
const logger = require('../../util/logger');

let mongoServerRef = null;

const startServer = async () => {
  mongoServerRef = await MongoMemoryServer.create();
  logger.info('Local mongoDB memory server started');
  
  const uri = mongoServerRef.getUri();
  const config = {
    useNewUrlParser: true,
    dbname: 'todo_db_in_memory'
  };
  return { uri, config }; 
}

const stopServer = async () => {
  if (!mongoServerRef) return;
  await mongoServerRef.stop(); // stop and cleanup db automatically;
  mongoServerRef = null;
  logger.info('Local mongoDB memory server stoped');
}

module.exports = { startServer, stopServer }