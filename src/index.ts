import fastify from "fastify";
import { giftRoutes } from "./routes/giftRoutes";

const server = fastify();

server.get("/test", async (request, reply) => {});

server.register(giftRoutes);

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});

// console.log('Happy developing ✨')
