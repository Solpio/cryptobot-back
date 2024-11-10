import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { updatePurchase } from "../../dao/purchase/updatePurchase";
import { getPurchase } from "../../dao/purchase/getPurchase";
import { PurchaseStatus } from "@prisma/client";
import { cryptoPayValidationMiddleware } from "../../middlewares/cryptoPayValidationMiddleware";
import { sendPurchaseNotification } from "../../bot/utils/sendPurchaseNotification";
import { getGift } from "../../dao/gift/getGift";
import { getUser } from "../../dao/user/getUser";

export interface IBody {
  update_id: number;
  update_type: string;
  request_date: string;
  payload: Payload;
}

export interface Payload {
  invoice_id: number;
  hash: string;
  currency_type: string;
  asset: string;
  amount: string;
  paid_asset: string;
  paid_amount: string;
  fee_asset: string;
  fee_amount: string;
  fee: string;
  fee_in_usd: string;
  pay_url: string;
  bot_invoice_url: string;
  mini_app_invoice_url: string;
  web_app_invoice_url: string;
  description: string;
  status: string;
  created_at: string;
  allow_comments: boolean;
  allow_anonymous: boolean;
  paid_usd_rate: string;
  usd_rate: string;
  paid_at: string;
  paid_anonymously: boolean;
  payload: string;
}

export async function payRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: IBody }>(
    "/pay",
    { preHandler: cryptoPayValidationMiddleware },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const body = request.body as IBody;

        if (body?.payload?.payload && body.payload.status === "paid") {
          const purchase = await getPurchase(body.payload.payload);
          if (purchase && purchase.status === PurchaseStatus.PENDING_PAYMENT) {
            await updatePurchase({
              id: purchase.id,
              status: PurchaseStatus.PAID,
            });

            const gift = await getGift(purchase.giftId);
            const user = await getUser(purchase.userId);

            if (user && gift) {
              await sendPurchaseNotification({
                purchaseId: purchase.id,
                text: `✅ You have purchased the gift of ${gift.name}`,
                buttonText: "Open Gifts",
                chatId: user.tgId,
              });
            }
          }
        }

        reply.status(200);
      } catch (error) {
        return reply.status(500).send({ message: "Some error" });
      }
    },
  );
}
