import prisma from "../../database/prisma";
import { Purchase } from "@prisma/client";

export const getPurchase = async (
  id: string,
): Promise<Purchase | undefined | null> => {
  try {
    const purchase = await prisma.purchase.findFirst({ where: { id } });
    console.log("Purchase found: ", purchase);
    return purchase;
  } catch (error) {
    console.error("Error getting purchase:", error);
  }
};
