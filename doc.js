const express = require('express');
const app = express();
const swaggerAutogen = require('swagger-autogen')({openapi: '3.0.0'});
const outputFile = './swagger.json';
const endpointsFiles = ['./app.js'];

const doc = {
  info: {
    version: '2.0.0',            
    title: 'Trentus API',             
    description: 'Documentazione delle API di Trentus'        
  },
  servers: [
    {
      url: 'http://localhost:8080',             
      description: 'Server Locale'      
    },
  ],
  securityDefinitions: {
    BearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Bearer token per accedere alle API',
    },
  },
  security: [{ BearerAuth: [] }],
  components: {
    schemas: {}
  }
}

const fs = require('fs');
const schemas = JSON.parse(fs.readFileSync('./obj.json', 'utf-8'));

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger documentation generated!');

  // 🛠 Modify swagger.json to inject schemas
  const swaggerData = JSON.parse(fs.readFileSync(outputFile, 'utf-8'));
  swaggerData.components = swaggerData.components || {}; // Ensure components exist
  swaggerData.components.schemas = schemas; // Inject schemas

  // Save the modified file
  fs.writeFileSync(outputFile, JSON.stringify(swaggerData, null, 2));
  console.log('Schemas added to Swagger JSON!');
});