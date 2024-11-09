import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export async function payRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/pay",
    async (request: FastifyRequest, reply: FastifyReply) => {},
  );
}
