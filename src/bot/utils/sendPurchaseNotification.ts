import { InlineKeyboard } from "grammy";
import { bot } from "../bot";

export interface SendPurchaseNotification {
  purchaseId: string;
  chatId: number;
  text: string;
  buttonText: string;
}

export const sendPurchaseNotification = async ({
  purchaseId,
  text,
  chatId,
  buttonText,
}: SendPurchaseNotification) => {
  const webAppUrl = process.env.WEB_APP_URL || "";
  const keyboard = new InlineKeyboard().webApp(
    buttonText,
    `${webAppUrl}?purchaseId=${purchaseId}`,
  );

  await bot.api.sendMessage(chatId, text, { reply_markup: keyboard });
};