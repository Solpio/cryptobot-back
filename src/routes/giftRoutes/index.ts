import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { CurrencyAsset } from "@prisma/client";
import { createGift } from "../../dao/gift/createGift";
import { getGifts } from "../../dao/gift/getGifts";
import { IUpdateGift, updateGift } from "../../dao/gift/updateGift";
import { cryptoBotClient } from "../../cryptoBot/cryptoBot";

interface CreateGiftBody {
  name: string;
  price: number;
  currency: CurrencyAsset;
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
        const me = await cryptoBotClient.getBalances();
        console.log(me);
        const gifts = await getGifts();

        reply.status(200).send(gifts);
      } catch (error) {
        console.error("Error getting gifts:", error);
        reply.status(500).send({ error: "Unable to create gift" });
      }
    },
  );
  fastify.patch(
    "/gifts/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = request.params as { id: string };
        const data = request.body as Omit<IUpdateGift, "id">;

        const gift = await updateGift({ id, ...data });

        reply.status(200).send(gift);
      } catch (error) {
        console.error("Error updating gift:", error);
        reply.status(500).send({ error: "Unable to create gift" });
      }
    },
  );
}
