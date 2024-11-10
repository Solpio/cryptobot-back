import prisma from "../../database/prisma";
import { Purchase } from "@prisma/client";
import { updatePurchase } from "./updatePurchase";
import { createOwnerHistory } from "../ownerHistory/createOwnerHistory";

interface ISendGift {
  purchaseId: string;
  nextOwnerId: string;
}

export const receivePurchase = async ({
  purchaseId,
  nextOwnerId,
}: ISendGift): Promise<Error | Purchase | undefined> => {
  try {
    const prevHistory = await prisma.purchaseOwnerChangeHistory.findFirst({
      where: { purchaseId: purchaseId },
      orderBy: { createdAt: "desc" },
    });
    console.log("Prev history found: ", prevHistory);

    if (!prevHistory) {
      return new Error("Purchase history not found");
    }
    const actualHistory = await createOwnerHistory({
      ownerId: nextOwnerId,
      purchaseId,
      previousOwnerId: prevHistory.ownerId,
    });
    console.log("History create: ", actualHistory);
    const purchase = await updatePurchase({
      id: purchaseId,
      userId: nextOwnerId,
    });
    console.log("Purchase send: ", purchase);
    return purchase;
  } catch (error) {
    console.error("Error sending purchase:", error);
  }
};
