import { User, UserPhoto } from "@prisma/client";
import prisma from "../../database/prisma";
import { getPurchasesCountByUser } from "../purchase/getPurchasesCountByUser";

type LeaderboardData = {
  giftsCount: number;
  userPhoto: UserPhoto | null;
} & User;

export const getLeaderboard = async (): Promise<
  LeaderboardData[] | undefined
> => {
  try {
    const leaderboard: LeaderboardData[] | undefined = (
      await prisma.user.findMany({ include: { userPhoto: true } })
    )?.map((user) => ({
      ...user,
      giftsCount: 0,
    }));

    if (!leaderboard) {
      return;
    }
    for (const user of leaderboard) {
      user.giftsCount = (await getPurchasesCountByUser(user.id)) ?? 0;
    }
    leaderboard.sort((a, b) => b.giftsCount - a.giftsCount);
    console.log("Users leaderboard: ", leaderboard);
    return leaderboard;
  } catch (error) {
    console.error("Error getting leaderboard:", error);
  }
};
