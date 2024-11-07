import { UserPhoto } from "@prisma/client";
import prisma from "../../database/prisma";

export const getUserPhotoByUser = async (
  userId: string,
): Promise<UserPhoto | undefined | null> => {
  try {
    const userPhoto = await prisma.userPhoto.findFirst({ where: { userId } });
    console.log("User photo found: ", userPhoto);
    return userPhoto;
  } catch (error) {
    console.error("Error getting userphoto:", error);
  }
};
