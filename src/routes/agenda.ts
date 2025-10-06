import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { requireAuth } from '../middleware/auth';

export default async function agendaRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  // Get agenda for a specific date range
  fastify.get('/agenda', {
    preHandler: requireAuth,
    schema: {
      description: 'Get appointments for a specific date range',
      tags: ['Agenda'],
      querystring: {
        type: 'object',
        required: ['startDate', 'endDate'],
        properties: {
          startDate: {
            type: 'string',
            format: 'date',
            description: 'Start date (e.g., 2025-09-03)',
            pattern: '^\\d{4}-\\d{2}-\\d{2}$'
          },
          endDate: {
            type: 'string',
            format: 'date',
            description: 'End date (e.g., 2025-09-04)',
            pattern: '^\\d{4}-\\d{2}-\\d{2}$'
          },
          semFalta: {
            type: 'boolean',
            default: false,
            description: 'Whether to exclude no-shows'
          },
          status: {
            type: 'string',
            description: 'Filter by status (e.g., "Confirmado", "Agendado", "Falta")'
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
                  id: { type: 'number', description: 'Appointment ID' },
                  data: { type: 'string', format: 'date', description: 'Appointment date (yyyy-MM-dd)' },
                  horaInicio: { type: 'string', description: 'Start time (HH:mm)' },
                  horaFim: { type: 'string', description: 'End time (HH:mm)' },
                  nomePessoa: { type: 'string', description: 'Patient name' },
                  telefone: { type: ['string', 'null'], description: 'Phone number' },
                  celular: { type: 'string', description: 'Mobile number' },
                  servicos: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'List of services'
                  },
                  status: { type: 'string', description: 'Appointment status' }
                }
              }
            },
            count: { type: 'number', description: 'Total number of appointments' }
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
    const { startDate, endDate, semFalta = false, status } = request.query as {
      startDate: string;
      endDate: string;
      semFalta?: boolean;
      status?: string;
    };

    try {
      // Convert yyyy-MM-dd to ISO format for external API
      const startDateISO = `${startDate}T03:00:00.000Z`;
      const endDateISO = `${endDate}T03:00:00.000Z`;

      const agenda = await fastify.clinicaOnClient.getAgenda(startDateISO, endDateISO, semFalta, status);

      reply.send({
        success: true,
        data: agenda,
        count: agenda.length
      });
    } catch (error: any) {
      fastify.log.error('Agenda fetch error:', error);
      reply.status(500).send({
        error: 'Failed to fetch agenda',
        message: error.message || 'Internal server error'
      });
    }
  });

  // Get agenda for a specific date (convenience endpoint)
  fastify.get('/agenda/date/:date', {
    preHandler: requireAuth,
    schema: {
      description: 'Get appointments for a specific date',
      tags: ['Agenda'],
      params: {
        type: 'object',
        required: ['date'],
        properties: {
          date: { 
            type: 'string', 
            format: 'date',
            description: 'Date in YYYY-MM-DD format'
          }
        }
      },
      querystring: {
        type: 'object',
        properties: {
          semFalta: { 
            type: 'boolean', 
            default: false,
            description: 'Whether to exclude no-shows'
          },
          status: {
            type: 'string',
            description: 'Filter by status (e.g., "Confirmado", "Agendado", "Falta")'
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            date: { type: 'string', format: 'date', description: 'Query date' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number', description: 'Appointment ID' },
                  data: { type: 'string', format: 'date', description: 'Appointment date (yyyy-MM-dd)' },
                  horaInicio: { type: 'string', description: 'Start time (HH:mm)' },
                  horaFim: { type: 'string', description: 'End time (HH:mm)' },
                  nomePessoa: { type: 'string', description: 'Patient name' },
                  telefone: { type: ['string', 'null'], description: 'Phone number' },
                  celular: { type: 'string', description: 'Mobile number' },
                  servicos: { type: 'array', items: { type: 'string' }, description: 'List of services' },
                  status: { type: 'string', description: 'Appointment status' }
                }
              }
            },
            count: { type: 'number', description: 'Total number of appointments' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { date } = request.params as { date: string };
    const { semFalta = false, status } = request.query as { semFalta?: boolean; status?: string };

    try {
      // Convert date to ISO format with timezone offset
      const startDate = `${date}T03:00:00.000Z`;
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      const endDate = `${nextDay.toISOString().split('T')[0]}T03:00:00.000Z`;

      const agenda = await fastify.clinicaOnClient.getAgenda(startDate, endDate, semFalta, status);
      
      reply.send({
        success: true,
        date,
        data: agenda,
        count: agenda.length
      });
    } catch (error: any) {
      fastify.log.error('Agenda fetch error:', error);
      reply.status(500).send({
        error: 'Failed to fetch agenda',
        message: error.message || 'Internal server error'
      });
    }
  });
}