const logger = require('../../util/logger');

const requestLogger = (request, response, next) => {
  const { method, path, body } = request;
  const dateTime = new Date().toJSON();
  logger.info('-----------------------------------');
  logger.info('Incoming request');
  logger.info('Method  : ', method);
  logger.info('Path    : ', path);
  logger.info('Body    : ', body);
  logger.info('DateTime: ', dateTime);
  next();
}

module.exports = { requestLogger }