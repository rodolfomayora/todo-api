const mongoose = require('mongoose');
const logger = require('../../util/logger');
const errorCodes = require('../../util/errorCodes');

const requestLogger = (request, response, next) => {
  const { method, path, body } = request;
  const dateTime = new Date().toJSON();
  logger.info('-----------------------------------');
  logger.info('Incoming request');
  logger.info('Method  : ', method);
  logger.info('Path    : ', path);
  logger.info('Body    : ', body);
  logger.info('DateTime: ', dateTime);
  return next();
}

const unknownRoute = (request, response, next) => {
  const error = new Error('The resquested resource was not found on this server');
  error.code = errorCodes.UNKNOWN_ROUTE;
  return next(error);
}

const mongooseConnection = (request, response, next) => {
  const isDatabaseConnected = mongoose.connection.readyState === 1;
  if (!isDatabaseConnected) {
    const error = new Error('Database not connected yet');
    error.code = errorCodes.UNAVAILABLE_SERVICE;
    return next(error);
  }
  return next();
}

module.exports = {
  requestLogger,
  unknownRoute,
  mongooseConnection
}