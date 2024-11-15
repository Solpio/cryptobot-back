import fastify from "fastify";
import { giftRoutes } from "./routes/giftRoutes";
import { bot } from "./bot/bot";
import fastifyCors from "@fastify/cors";
import { authMiddleware } from "./middlewares/authMiddleware";
import { purchaseRoutes } from "./routes/purchaseRoutes";
import { userRoutes } from "./routes/userRoutes";
import { leaderboardRoutes } from "./routes/leaderboardRoutes";
import { payRoutes } from "./routes/pay";

const server = fastify({ logger: true });

server.register(fastifyCors, {
  origin: true,
});
server.register(giftRoutes);
server.register(purchaseRoutes);
server.register(userRoutes);
server.register(leaderboardRoutes);
server.register(payRoutes);

server.addHook("preHandler", authMiddleware);

server.get("/", async (req, reply) => {
  reply.status(200).send("Hello world");
});

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
