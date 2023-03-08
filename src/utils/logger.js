const config = require('./config');

const info = (...props) => {
  if (config.ENV !== 'testing') console.log(...props);
}

const error = (...props) => {
  if (config.ENV !== 'testing') console.error(...props);
}

module.exports = { info, error };