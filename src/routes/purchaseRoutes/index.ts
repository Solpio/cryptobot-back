import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import { getIdByToken } from "../../utils/auth";
import { getUser } from "../../dao/user/getUser";
import { createPurchase } from "../../dao/purchase/createPurchase";
import { getGift } from "../../dao/gift/getGift";

interface GetPurchaseBody {
  giftId: string;
  recipientTgId: number;
  recipientId?: string;
}

const requestSchema: FastifySchema = {
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

export async function purchaseRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: GetPurchaseBody }>(
    "/purchase",
    { schema: requestSchema },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = +getIdByToken(request.headers.authorization || "");
        const user = await getUser(userId);
        const { giftId, recipientTgId, recipientId } =
          request.body as GetPurchaseBody;

        const recipient = await getUser(recipientTgId);
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
          currencyType: "crypto",
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
}
