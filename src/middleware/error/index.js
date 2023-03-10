const logger = require('../../util/logger');
const errorCodes = require('../../util/errorCodes');

const errorLogger = (error, request, response, next) => {
  logger.info('-----------------------------------');
  logger.error(error.stack);
  next(error);
}

const errorResponse = (error, request, response, next) => {

  if (error?.code === errorCodes.UNKNOWN_ROUTE) {
    return response.status(404).json({ message: error.message });
  }

  return response.status(500).json({ message: 'Server Error' });
}

module.exports = { errorResponse, errorLogger }