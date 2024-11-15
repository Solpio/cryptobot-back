import { Gift } from "@prisma/client";
import prisma from "../../database/prisma";

type ICreateGift = Pick<Gift, "name" | "currency" | "price" | "total"> & {
  lottie: any;
};

export const createGift = async (
  data: ICreateGift,
): Promise<Gift | undefined> => {
  try {
    const gift = await prisma.gift.create({
      data: {
        name: data.name,
        price: data.price,
        currency: data.currency,
        total: data.total,
        lottie: data.lottie,
      },
    });
    console.log("Gift created:", gift);
    return gift;
  } catch (error) {
    console.error("Error creating gift:", error);
  }
};
