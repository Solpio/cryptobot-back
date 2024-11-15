import { Gift } from "@prisma/client";
import prisma from "../../database/prisma";

export const getGifts = async (): Promise<Gift[] | undefined> => {
  try {
    const gifts = await prisma.gift.findMany();
    console.log("Gifts filters: ");
    console.log("Gifts found", gifts);
    return gifts;
  } catch (error) {
    console.error("Error getting gifts:", error);
  }
};
