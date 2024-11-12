import {
  Bot,
  InlineKeyboard,
  InputFile,
  InlineQueryResultBuilder,
  GrammyError,
} from "grammy";
import { getUserByTg } from "../dao/user/getUserByTg";
import { createUser } from "../dao/user/createUser";
import { createUserPhoto } from "../dao/userPhoto/createUserPhoto";
import { User } from "@prisma/client";
import { getUserPhotoByUser } from "../dao/userPhoto/getUserPhotoByUser";
import { updateUserPhoto } from "../dao/userPhoto/updateUserPhoto";
import { join } from "path";
import { getPurchase } from "../dao/purchase/getPurchase";
import { getGift } from "../dao/gift/getGift";

export const bot = new Bot(process.env.BOT_TOKEN ?? "");

bot.command("start", async (ctx) => {
  let userData: User | null = null;
  if (ctx.from) {
    const existUser = await getUserByTg(ctx.from.id);

    if (!existUser) {
      const tgUser = ctx.from;
      const user = await createUser({
        languageCode: tgUser.language_code ?? null,
        tgId: tgUser.id,
        lastName: tgUser.last_name ?? null,
        firstName: tgUser.first_name,
        username: tgUser.username ?? null,
      });
      if (user) {
        userData = user;
      }
    } else {
      userData = existUser;
    }
  }

  const userPhotos = await ctx.api.getUserProfilePhotos(ctx.from?.id || 0);
  if (userData && userPhotos.total_count) {
    const largestPhoto = userPhotos.photos[0][userPhotos.photos[0].length - 1];
    const fileUrl = await ctx.api
      .getFile(largestPhoto.file_id)
      .then(
        (file) =>
          `https://api.telegram.org/file/bot${ctx.api.token}/${file.file_path}`,
      );

    const existUserPhoto = await getUserPhotoByUser(userData.id);

    if (existUserPhoto) {
      await updateUserPhoto({
        fileId: largestPhoto.file_id,
        userId: userData.id,
      });
    } else {
      await createUserPhoto({
        fileId: largestPhoto.file_id,
        photoUrl: fileUrl,
        userId: userData.id,
      });
    }
  }
  const webAppUrl = process.env.WEB_APP_URL || "";
  const keyboard = new InlineKeyboard().webApp("Open App", webAppUrl);
  const photoPath = join(__dirname, "img.png");

  const photo = new InputFile(photoPath);

  await ctx.replyWithPhoto(photo, {
    reply_markup: keyboard,
    caption: "🎁 Here you can buy and send gifts to your friends",
  });
});

bot.on("inline_query", async (ctx) => {
  const purchaseId = ctx.inlineQuery.query.trim();
  if (!purchaseId) {
    return;
  }
  const purchase = await getPurchase(purchaseId);
  if (purchase) {
    const gift = await getGift(purchase.giftId);
    if (gift) {
      const webAppUrl = process.env.TELEGRAM_WEB_APP_URL || "";
      const result = InlineQueryResultBuilder.article("1", "Send Gift", {
        thumbnail_url:
          "https://api.ru-1.storage.selcloud.ru/v2/panel/links/9132ea353ab3d3eb0374d9f4bdc41117bb8df38e",
        description: `Send a gift ${gift.name}.`,
      }).text("🎁 I have a <b>gift</b> for you! Tap the button to open it.", {
        parse_mode: "HTML",
      });

      result.reply_markup = new InlineKeyboard().url(
        "Открыть Web App",
        `${webAppUrl}?purchaseId=${purchaseId}&sending=true`,
      );

      await ctx.answerInlineQuery([result]);
    }
  }
});

bot.catch((err) => {
  console.error("Произошла ошибка:", err);

  // Если ошибка из-за вызова API, можно получить больше информации
  if (err instanceof GrammyError) {
    console.error("Ошибка API:", err.description);
  } else {
    console.error("Другая ошибка:", err);
  }
});
