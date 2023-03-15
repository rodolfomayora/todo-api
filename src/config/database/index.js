const env = require('../env');
const database = (env.IS_DEVELOPMENT || env.IS_TESTING)
  ? require('../mongoMemory')
  : require('../mongoDB');

module.exports = {
  openConnection: database.openConnection,
  closeConnection: database.closeConnection,
};