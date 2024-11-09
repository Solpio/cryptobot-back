import prisma from "../../database/prisma";
import { User } from "@prisma/client";

export const getUserByTg = async (
  tgId: number,
): Promise<User | null | undefined> => {
  try {
    const user = await prisma.user.findUnique({ where: { tgId } });
    console.log("User found: ", user);
    return user;
  } catch (error) {
    console.error("Error getting  user:", error);
  }
};
