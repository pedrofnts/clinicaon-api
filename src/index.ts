import 'dotenv/config';
import Fastify from 'fastify';
import { ClinicaOnClient } from './services/clinicaon-client';

const fastify = Fastify({ 
  logger: true 
});

// Register plugins
fastify.register(import('@fastify/swagger'), {
  swagger: {
    info: {
      title: 'ClinicaOn API Wrapper',
      description: 'HTTP wrapper for ClinicaOn system API',
      version: '1.0.0'
    },
    host: 'localhost:3000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'Authentication', description: 'Authentication endpoints' },
      { name: 'API', description: 'ClinicaOn API wrapper endpoints' }
    ]
  }
});

fastify.register(import('@fastify/swagger-ui'), {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  }
});

// Initialize ClinicaOn client
const clinicaOnClient = new ClinicaOnClient(process.env.CLINICAON_BASE_URL);
fastify.decorate('clinicaOnClient', clinicaOnClient);

// Register routes
fastify.register(import('./routes/auth'), { prefix: '/api' });
fastify.register(import('./routes/agenda'), { prefix: '/api' });

// Health check endpoint
fastify.get('/', {
  schema: {
    description: 'Health check endpoint',
    response: {
      200: {
        type: 'object',
        properties: {
          status: { type: 'string' },
          service: { type: 'string' },
          timestamp: { type: 'string' }
        }
      }
    }
  }
}, async (request, reply) => {
  return {
    status: 'healthy',
    service: 'ClinicaOn API Wrapper',
    timestamp: new Date().toISOString()
  };
});

// Error handler
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  reply.status(500).send({
    error: 'Internal Server Error',
    message: error.message
  });
});

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3000');
    await fastify.listen({ port, host: '0.0.0.0' });
    
    fastify.log.info(`Server running at http://localhost:${port}`);
    fastify.log.info(`API documentation available at http://localhost:${port}/docs`);
    
    // Auto-login if credentials are provided
    if (process.env.CLINICAON_EMAIL && process.env.CLINICAON_PASSWORD) {
      try {
        await clinicaOnClient.login(process.env.CLINICAON_EMAIL, process.env.CLINICAON_PASSWORD);
        fastify.log.info('Auto-login successful');
      } catch (error: any) {
        fastify.log.warn('Auto-login failed:', error.message || error);
      }
    }
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();