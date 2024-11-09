import { User } from "@prisma/client";
import prisma from "../../database/prisma";

export const getUserList = async (): Promise<User[] | undefined> => {
  try {
    const users = await prisma.user.findMany({ include: { userPhoto: true } });
    console.log("Users found: ", users);
    return users;
  } catch (error) {
    console.error("Error getting user list:", error);
  }
};
