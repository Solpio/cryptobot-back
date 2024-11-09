import { Purchase } from "@prisma/client";
import prisma from "../../database/prisma";

export const getPurchasesCountByUser = async (
  userId: string,
): Promise<number | undefined> => {
  try {
    const purchasesCount = await prisma.purchase.count({
      where: { recipientId: userId, status: "PAID" },
    });
    console.log("Purchases count by user found: ", purchasesCount);
    return purchasesCount;
  } catch (error) {
    console.error("Error getting purchases count by user:", error);
  }
};
