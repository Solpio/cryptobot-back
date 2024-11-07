import fastify from "fastify";
import { giftRoutes } from "./routes/giftRoutes";
import { bot } from "./bot/bot";
import fastifyCors from "@fastify/cors";

const server = fastify({ logger: true });

server.register(fastifyCors, {
  origin: true,
});
server.register(giftRoutes);
server.get("/", async (req, reply) => {
  reply.status(200).send("Hello world");
});
// server.addHook("preHandler", authMiddleware);

bot.start().then(() => {
  console.log("Telegram Bot запущен!");
});

server.listen(
  { port: +(process.env.PORT || 8080), host: "0.0.0.0" },
  (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  },
);
