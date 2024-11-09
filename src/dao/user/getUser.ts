import prisma from "../../database/prisma";
import { User } from "@prisma/client";

export const getUser = async (id: string): Promise<User | null | undefined> => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    console.log("User found: ", user);
    return user;
  } catch (error) {
    console.error("Error getting  user:", error);
  }
};
