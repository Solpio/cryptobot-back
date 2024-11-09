import prisma from "../../database/prisma";

export const getPurchasesCountByGift = async (
  giftId: string,
): Promise<number | undefined> => {
  try {
    const count = await prisma.purchase.count({ where: { giftId } });
    console.log(`Counting gift ${giftId} purchases: `, count);
    return count;
  } catch (error) {
    console.error("Error counting gifts purchases:", error);
  }
};
