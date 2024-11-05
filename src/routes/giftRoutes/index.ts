import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Currency } from "@prisma/client";
import { createGift } from "../../dao/gift/createGift";
import { getGifts } from "../../dao/gift/getGifts";

interface CreateGiftBody {
  name: string;
  price: number;
  currency: Currency;
  total: number;
  lottie: any;
}

export async function giftRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/gifts",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { name, price, currency, total, lottie } =
        request.body as CreateGiftBody;

      try {
        const newGift = await createGift({
          name,
          price,
          currency,
          total,
          lottie,
        });

        reply.status(201).send(newGift);
      } catch (error) {
        console.error("Error creating gift:", error);
        reply.status(500).send({ error: "Unable to create gift" });
      }
    },
  );
  fastify.get(
    "/gifts",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const gifts = await getGifts();

        reply.status(200).send(gifts);
      } catch (error) {
        console.error("Error getting gifts:", error);
        reply.status(500).send({ error: "Unable to create gift" });
      }
    },
  );
}
