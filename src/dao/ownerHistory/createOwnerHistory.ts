import { PurchaseOwnerChangeHistory } from "@prisma/client";
import prisma from "../../database/prisma";

interface ICreateOwnerHistory {
  ownerId: string;
  previousOwnerId?: string;
  purchaseId: string;
}

export const createOwnerHistory = async (
  data: ICreateOwnerHistory,
): Promise<PurchaseOwnerChangeHistory | undefined> => {
  try {
    const ownerHistory = await prisma.purchaseOwnerChangeHistory.create({
      data: { ...data },
    });
    console.log("Owner history created: ", ownerHistory);
    return ownerHistory;
  } catch (error) {
    console.error("Error creating owner history:", error);
  }
};
