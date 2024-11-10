import { PurchaseOwnerChangeHistory } from "@prisma/client";
import prisma from "../../database/prisma";

export const getPurchaseHistory = async (
  purchaseId: string,
): Promise<PurchaseOwnerChangeHistory[] | undefined> => {
  try {
    const purchaseHistory = await prisma.purchaseOwnerChangeHistory.findMany({
      where: { purchaseId },
      include: { owner: true, previousOwner: true },
    });
    console.log("Purchase history found: ", purchaseHistory);
    return purchaseHistory;
  } catch (error) {
    console.error("Error getting purchase history:", error);
  }
};
