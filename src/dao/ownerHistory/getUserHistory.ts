import { PurchaseOwnerChangeHistory } from "@prisma/client";
import prisma from "../../database/prisma";

export const getUserHistory = async (
  userId: string,
): Promise<PurchaseOwnerChangeHistory[] | undefined> => {
  try {
    const purchaseHistory = await prisma.purchaseOwnerChangeHistory.findMany({
      where: { OR: [{ ownerId: userId }, { previousOwnerId: userId }] },
      include: { owner: true, previousOwner: true },
    });
    console.log("User history found: ", purchaseHistory);
    return purchaseHistory;
  } catch (error) {
    console.error("Error getting user history:", error);
  }
};
