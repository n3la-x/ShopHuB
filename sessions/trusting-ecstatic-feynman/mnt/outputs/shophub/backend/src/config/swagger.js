const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ShopHub API',
      version: '1.0.0',
      description: 'ShopHub E-Commerce REST API Documentation',
    },
    servers: [{ url: 'http://localhost:5000/api' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/routes/*.js'],
};

const setupSwagger = (app) => {
  const specs = swaggerJsdoc(options);
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));
  console.log('📖 Swagger docs: http://localhost:5000/api/docs');
};

module.exports = { setupSwagger };
