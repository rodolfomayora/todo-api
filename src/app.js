require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiMiddeware = require('./middleware/api');
const errorMiddleware = require('./middleware/error');
const swagger = require('./config/swagger');
const routers = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiMiddeware.requestLogger);
app.use(apiMiddeware.mongooseConnection);
app.use('/api/v1/docs', swagger.middleware, swagger.controller);
app.use('/api/v1', routers);
app.use(apiMiddeware.unknownRoute);
app.use(errorMiddleware.errorLogger);
app.use(errorMiddleware.errorResponse);

module.exports = app;