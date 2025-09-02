import { FastifyInstance, FastifyPluginOptions } from 'fastify';

export default async function authRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  // Login endpoint
  fastify.post('/auth/login', {
    schema: {
      description: 'Authenticate with ClinicaOn system',
      tags: ['Authentication'],
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', description: 'User email/username' },
          password: { type: 'string', description: 'User password' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                userName: { type: 'string' },
                nomeUsuario: { type: 'string' },
                nomeUnidade: { type: 'string' },
                unidadeId: { type: 'number' },
                tipoAssinatura: { type: 'number' },
                nutricional: { type: 'boolean' }
              }
            }
          }
        },
        401: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { email, password } = request.body as { email: string; password: string };

    try {
      const loginResponse = await fastify.clinicaOnClient.login(email, password);
      
      if (!loginResponse.sucesso) {
        reply.status(401).send({
          error: 'Authentication failed',
          message: 'Invalid credentials'
        });
        return;
      }

      reply.send({
        success: true,
        message: 'Login successful',
        user: {
          id: loginResponse.usuarioid,
          userName: loginResponse.userName,
          nomeUsuario: loginResponse.nomeUsuario,
          nomeUnidade: loginResponse.nomeUnidade,
          unidadeId: loginResponse.unidadeId,
          tipoAssinatura: loginResponse.tipoAssinatura,
          nutricional: loginResponse.nutricional
        }
      });
    } catch (error: any) {
      fastify.log.error('Login error:', error);
      reply.status(401).send({
        error: 'Authentication failed',
        message: error.response?.data?.message || 'Invalid credentials'
      });
    }
  });

  // Token status endpoint
  fastify.get('/auth/status', {
    schema: {
      description: 'Check authentication status',
      tags: ['Authentication'],
      response: {
        200: {
          type: 'object',
          properties: {
            authenticated: { type: 'boolean' },
            token: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const isValid = fastify.clinicaOnClient.isTokenValid();
    const token = fastify.clinicaOnClient.getToken();
    
    reply.send({
      authenticated: isValid,
      token: isValid ? token : null
    });
  });
}