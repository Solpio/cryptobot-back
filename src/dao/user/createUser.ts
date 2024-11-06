import { User } from "@prisma/client";
import prisma from "../../database/prisma";

type ICreateUser = Pick<
  User,
  "tgId" | "firstName" | "lastName" | "username" | "languageCode"
>;

export const createUser = async (
  userDto: ICreateUser,
): Promise<User | undefined> => {
  try {
    const user = await prisma.user.create({
      data: {
        tgId: userDto.tgId,
        firstName: userDto.firstName,
        lastName: userDto.lastName,
        username: userDto.lastName,
        languageCode: userDto.languageCode,
      },
    });

    console.log(`User created:`, user);
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
  }
};
