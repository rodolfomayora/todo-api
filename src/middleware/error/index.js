const errorCodes = require('../../util/errorCodes');

const errorResponse = (error, request, response, next) => {

  if (error?.code === errorCodes.UNKNOWN_ROUTE) {
    return response.status(404).json({ message: error.message });
  }

  return response.status(500).json({ message: 'Server Error' });
}

module.exports = { errorResponse }