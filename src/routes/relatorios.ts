import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { requireAuth } from '../middleware/auth';

export default async function relatoriosRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  // Get birthday celebrants report
  fastify.get('/relatorios/aniversariantes', {
    preHandler: requireAuth,
    schema: {
      description: 'Get birthday celebrants for a specific date range',
      tags: ['Relatorios'],
      querystring: {
        type: 'object',
        required: ['startDate', 'endDate'],
        properties: {
          startDate: { 
            type: 'string', 
            format: 'date',
            description: 'Start date in YYYY-MM-DD format (e.g., 2025-09-01)'
          },
          endDate: { 
            type: 'string', 
            format: 'date',
            description: 'End date in YYYY-MM-DD format (e.g., 2025-09-30)'
          },
          situacaoId: {
            type: 'string',
            default: '',
            description: 'Filter by situation ID (optional)'
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  pessoaId: { type: 'number', description: 'Person ID' },
                  data: { type: 'string', description: 'Birthday date in MM/DD format' },
                  nomeCliente: { type: 'string', description: 'Client name' },
                  sexo: { type: 'string', description: 'Gender (M/F)' },
                  telefone: { type: 'string', description: 'Phone number' },
                  celular: { type: 'string', description: 'Mobile number' },
                  email: { type: 'string', description: 'Email address' },
                  nomeSituacao: { type: 'string', description: 'Situation status' }
                }
              }
            },
            count: { type: 'number', description: 'Total number of birthday celebrants' },
            periodo: {
              type: 'object',
              properties: {
                startDate: { type: 'string' },
                endDate: { type: 'string' }
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
    const { startDate, endDate, situacaoId = '' } = request.query as {
      startDate: string;
      endDate: string;
      situacaoId?: string;
    };

    try {
      const aniversariantes = await fastify.clinicaOnClient.getAniversariantes(startDate, endDate, situacaoId);
      
      reply.send({
        success: true,
        data: aniversariantes,
        count: aniversariantes.length,
        periodo: {
          startDate,
          endDate
        }
      });
    } catch (error: any) {
      fastify.log.error('Aniversariantes fetch error:', error);
      reply.status(500).send({
        error: 'Failed to fetch aniversariantes',
        message: error.message || 'Internal server error'
      });
    }
  });
}