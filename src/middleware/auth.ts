import { FastifyRequest, FastifyReply } from 'fastify';
import { ClinicaOnClient } from '../services/clinicaon-client';

declare module 'fastify' {
  interface FastifyInstance {
    clinicaOnClient: ClinicaOnClient;
  }
}

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  const client = request.server.clinicaOnClient;
  
  if (!client.isTokenValid()) {
    reply.status(401).send({
      error: 'Unauthorized',
      message: 'Valid authentication token required'
    });
    return;
  }
}