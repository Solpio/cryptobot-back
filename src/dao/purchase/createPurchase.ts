import { Purchase, PurchaseStatus } from "@prisma/client";
import prisma from "../../database/prisma";

export type ICreatePurchase = Pick<
  Purchase,
  "amount" | "currencyType" | "currencyAsset" | "currencyFiat" | "recipientTgId"
> & {
  status: PurchaseStatus;
  giftId: string;
  userId: string;
  recipientId?: string;
};
export const createPurchase = async (
  data: ICreatePurchase,
): Promise<Purchase | undefined> => {
  try {
    const purchase = await prisma.purchase.create({
      data: {
        amount: data.amount,
        currencyType: data.currencyType,
        currencyFiat: data.currencyFiat,
        recipientTgId: data.recipientTgId,
        recipientId: data.recipientId,
        userId: data.userId,
        giftId: data.giftId,
        status: data.status,
      },
    });
    console.log("Purchase created:", purchase);
    return purchase;
  } catch (error) {
    console.error("Error creating purchase:", error);
  }
};