import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export async function payRoutes(fastify: FastifyInstance) {
  fastify.post("/pay", async (request: FastifyRequest, reply: FastifyReply) => {
    console.log("Params");
    console.log(JSON.stringify(request.params));
    console.log("Body");
    console.log(JSON.stringify(request.body));
    console.log("Query");
    console.log(JSON.stringify(request.query));
  });
}
