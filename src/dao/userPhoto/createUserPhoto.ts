import { UserPhoto } from "@prisma/client";
import prisma from "../../database/prisma";

type ICreateUserPhoto = Pick<UserPhoto, "userId" | "photoUrl" | "fileId">;

export const createUserPhoto = async (
  data: ICreateUserPhoto,
): Promise<UserPhoto | undefined> => {
  try {
    const userPhoto = await prisma.userPhoto.create({
      data: {
        userId: data.userId,
        photoUrl: data.photoUrl,
        fileId: data.fileId,
      },
    });
    console.log("user photo created:", userPhoto);
    return userPhoto;
  } catch (error) {
    console.error("Error creating user photo:", error);
  }
};
