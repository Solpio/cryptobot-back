import { ICreatePurchase } from "./createPurchase";
import { Purchase } from "@prisma/client";
import prisma from "../../database/prisma";

export type IUpdatePurchase = { id: string } & Partial<ICreatePurchase>;

export const updatePurchase = async ({
  id,
  ...data
}: IUpdatePurchase): Promise<Purchase | undefined> => {
  try {
    const purchase = await prisma.purchase.update({
      where: { id },
      data: { ...data },
    });
    console.log("Update purchase: ", purchase);
    return purchase;
  } catch (error) {
    console.error("Error updating purchase:", error);
  }
};
