import { Gift } from "@prisma/client";
import prisma from "../../database/prisma";

export type IUpdateGift = { id: string; lottie: any } & Partial<Gift>;

export const updateGift = async ({
  id,
  ...data
}: IUpdateGift): Promise<Gift | undefined> => {
  try {
    const gift = await prisma.gift.update({
      where: { id },
      data: {
        ...data,
      },
    });
    console.log("Updated gift: ", gift);
    return gift;
  } catch (error) {
    console.error("Error updating gift:", error);
  }
};
