import prisma from "../../database/prisma";
import { Purchase } from "@prisma/client";
import { updatePurchase } from "./updatePurchase";
import { createOwnerHistory } from "../ownerHistory/createOwnerHistory";

interface ISendGift {
  purchaseId: string;
  prevOwnerId: string;
  nextOwnerId: string;
}

export const sendPurchase = async ({
  purchaseId,
  prevOwnerId,
  nextOwnerId,
}: ISendGift): Promise<Error | Purchase | undefined> => {
  try {
    const prevHistory = await prisma.purchaseOwnerChangeHistory.findFirst({
      where: { ownerId: prevOwnerId, purchaseId: purchaseId },
      orderBy: { createdAt: "desc" },
    });
    console.log("Prev history found: ", prevHistory);

    if (!prevHistory) {
      return new Error("Not real owner");
    }
    const actualHistory = await createOwnerHistory({
      ownerId: nextOwnerId,
      purchaseId,
      previousOwnerId: prevOwnerId,
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
