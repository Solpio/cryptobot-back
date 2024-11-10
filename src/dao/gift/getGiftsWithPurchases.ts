import { Gift } from "@prisma/client";
import { getGifts } from "../purchase/getGifts";
import { getPurchasesCountByGift } from "../purchase/getPurchasesCountByGift";

type GifsWithPurchases = Gift & { purchasesCount: number };

export const getGiftsWithPurchases = async (): Promise<
  GifsWithPurchases[] | null
> => {
  const gifts: GifsWithPurchases[] | undefined = (await getGifts())?.map(
    (gift) => ({
      ...gift,
      purchasesCount: 0,
    }),
  );
  if (!gifts) {
    console.log("Error getting with purchases gifts");
    return null;
  }
  for (const gift of gifts) {
    gift.purchasesCount = (await getPurchasesCountByGift(gift.id)) ?? 0;
  }

  return gifts;
};
