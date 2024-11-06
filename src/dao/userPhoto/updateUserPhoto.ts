import { UserPhoto } from "@prisma/client";
import prisma from "../../database/prisma";

type IUpdateUserPhoto = {
  userId: number;
} & Partial<UserPhoto>;

export const updateUserPhoto = async ({
  userId,
  ...data
}: IUpdateUserPhoto): Promise<UserPhoto | undefined> => {
  try {
    const userPhoto = await prisma.userPhoto.update({
      data: { ...data },
      where: { userId },
    });
    console.log("User photo updating: ", userPhoto);
    return userPhoto;
  } catch (error) {
    console.error("Error updating userPhoto:", error);
  }
};
