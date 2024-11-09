import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import { getIdByToken } from "../../utils/auth";
import { getUserByTg } from "../../dao/user/getUserByTg";
import { createPurchase } from "../../dao/purchase/createPurchase";
import { getGift } from "../../dao/gift/getGift";
import { getPurchasesByUser } from "../../dao/purchase/getPurchasesByUser";
import { getUser } from "../../dao/user/getUser";

interface GetPurchaseBody {
  giftId: string;
  recipientTgId: number;
  recipientId?: string;
}

const postPurchaseRequestSchema: FastifySchema = {
  body: {
    type: "object",
    required: ["giftId", "recipientTgId"],
    properties: {
      giftId: { type: "string" },
      recipientTgId: { type: "number" },
      recipientId: { type: "string", nullable: true },
    },
  },
};

interface GetPurchaseByUserParams {
  id: string;
}

const getPurchaseByUserParamsSchema: FastifySchema = {
  params: {
    type: "object",
    properties: {
      id: { type: "string" }, // `id` — обязательный параметр типа string
    },
    required: ["id"],
  },
};

export async function purchaseRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: GetPurchaseBody }>(
    "/purchase",
    { schema: postPurchaseRequestSchema },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = +getIdByToken(request.headers.authorization || "");
        const user = await getUserByTg(userId);
        const { giftId, recipientTgId, recipientId } =
          request.body as GetPurchaseBody;

        const recipient = await getUserByTg(recipientTgId);
        const gift = await getGift(giftId);
        if (!gift) {
          return reply.status(404).send({ message: "Gift not found" });
        }
        if (!user) {
          return reply.status(404).send({ message: "User not found" });
        }
        const purchase = await createPurchase({
          userId: user.id,
          recipientTgId,
          recipientId: recipient?.id,
          amount: gift.price,
          giftId: giftId,
          status: "PAID",
          currencyType: "CRYPTO",
          currencyAsset: gift.currency,
          currencyFiat: null,
        });

        return reply.status(201).send(purchase);
      } catch (error) {
        console.error("Error creating purchase:", error);
        reply.status(500).send({ error: "Unable to create purchase" });
      }
    },
  );
  fastify.get<{ Params: GetPurchaseByUserParams }>(
    `/purchase/user/:id`,
    { schema: getPurchaseByUserParamsSchema },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as GetPurchaseByUserParams;
      const user = await getUser(id);

      if (!user) {
        return reply.status(404).send({ message: "User not found" });
      }

      const purchases = await getPurchasesByUser(user.id);

      reply.status(200).send(purchases);
    },
  );
}
