import fastify from "fastify";
import { giftRoutes } from "./routes/giftRoutes";
import { bot } from "./bot/bot";
import { authMiddleware } from "./middlewares/authMiddleware";

const server = fastify({ logger: true });

server.register(giftRoutes);
server.addHook("preHandler", authMiddleware);

bot.start().then(() => {
  console.log("Telegram Bot запущен!");
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});

// console.log('Happy developing ✨')
