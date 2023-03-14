const env = require('../config/env');

const info = (...props) => {
  if (!env.IS_TESTING) console.log(...props);
}

const error = (...props) => {
  if (!env.IS_TESTING) console.error(...props);
}

module.exports = { info, error };