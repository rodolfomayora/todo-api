const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const projectInfo = require('../../../package.json');
const env = require('../env');

const port = env.PORT;
const hostname = env.HOSTNAME
const host = env.IS_PRODUCTION ? hostname : `${hostname}:${port}`;
const basePath = '/api/v1';

const swaggerConfig = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TODO RESTful API',
      version: projectInfo.version,
      description: 'Basic RESTful API for todo-app based on the OpenAPI 3.0 Specification (OAS3). <br /><br />By',
      contact: {
        name: 'Rodolfo Mayora Pereda',
        url: 'https://rodolfo-mayora-pereda.vercel.app'
      }
    },
    host: host,
    basePath: basePath,
    servers: [
      {
        url: `${host}${basePath}`,
        // description: 'Local Development Server'
      }
    ]
  },
  apis: [
    `${__dirname}/../../apiServices/**/routes.js`
    // `**/routes.js`
  ]
}

const swaggerOptions = {
  customCssUrl: '/custom.css',
  customSiteTitle: 'TODO RESTful API by Rodolfo Mayora'
};

const config = swaggerJsDoc(swaggerConfig);
const middleware = swaggerUI.serve;
const controller = swaggerUI.setup(config, swaggerOptions);

module.exports = { middleware, controller };