import { Gift } from "@prisma/client";
import prisma from "../../database/prisma";

export const getGift = async (
  giftId: string,
): Promise<Gift | undefined | null> => {
  try {
    const gift = await prisma.gift.findFirst({ where: { id: giftId } });
    console.log("Gift found: ", gift);
    return gift;
  } catch (error) {
    console.error("Error getting gift:", error);
  }
};
