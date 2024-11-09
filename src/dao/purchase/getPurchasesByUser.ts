import { Purchase } from "@prisma/client";
import prisma from "../../database/prisma";

export const getPurchasesByUser = async (
  userId: string,
): Promise<Purchase[] | undefined> => {
  try {
    const purchases = await prisma.purchase.findMany({
      where: { id: userId, status: "PAID" },
      include: { user: true },
    });
    console.log("Purchases found: ", purchases);
    return purchases;
  } catch (error) {
    console.error("Error getting purchases by user:", error);
  }
};
