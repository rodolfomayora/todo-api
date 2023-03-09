const express = require('express');
const apiMiddeware = require('./middleware/api');
const errorMiddleware = require('./middleware/error');
const errorCodes = require('./util/errorCodes');

const app = express();

app.use(express.json()); // to allow JSON entries
app.use(apiMiddeware.requestLogger);

app.get('/api/v1', (reques, response) => {
  return response.status(200).json({ message: 'TODO RESTful API'});
})

app.use((request, response, next) => {
  const error = new Error('The resquested resource was not found on this server');
  error.code = errorCodes.UNKNOWN_ROUTE;
  next(error);
});

// error middlewares
app.use(errorMiddleware.errorResponse);

module.exports = app;