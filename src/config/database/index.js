const env = require('../env');
const mongoDB = require('../mongoDB');
const mongoMemory = require('../mongoMemory');

const setDatabaseMethod = (env) => {
  const isLocalEnvironment = env.IS_DEVELOPMENT || env.IS_TESTING;
  const localEnvironment = {
    openConnection: mongoMemory.openConnection,
    closeConnection: mongoMemory.closeConnection,
  }
  const webEnvironment =  {
    openConnection: mongoDB.openConnection,
    closeConnection: mongoDB.closeConnection,
  }

  return { ...(isLocalEnvironment ? localEnvironment : webEnvironment) }
}

module.exports = setDatabaseMethod(env);