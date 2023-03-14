const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const projectInfo = require('../../../package.json');
const env = require('../env');

const port = env.PORT;
const host = `http://localhost:${port}`;
const basePath = '/api/v1';

const swaggerConfig = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TODO RESTful API',
      version: projectInfo.version,
      description: 'Basic RESTful API for todo-app based on the OpenAPI 3.0 specification.'
    },
    host: host,
    basePath: basePath,
    servers: [
      {
        url: `${host}${basePath}`,
        description: 'Local Development Server'
      }
    ]
  },
  apis: [
    `${__dirname}/../../apiServices/**/routes.js`
    // `**/routes.js`
  ]
}

const config = swaggerJsDoc(swaggerConfig);
const middleware = swaggerUI.serve;
const controller = swaggerUI.setup(config);

module.exports = { middleware, controller };