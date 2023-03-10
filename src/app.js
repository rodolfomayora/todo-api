const express = require('express');
const apiMiddeware = require('./middleware/api');
const errorMiddleware = require('./middleware/error');

const app = express();

app.use(express.json()); // to allow JSON entries
app.use(apiMiddeware.requestLogger);
app.get('/api/v1', (reques, response) => {
  return response.status(200).json({ message: 'TODO RESTful API'});
})
app.use(apiMiddeware.unknownRoute);

// error middlewares
app.use(errorMiddleware.errorLogger);
app.use(errorMiddleware.errorResponse);

module.exports = app;