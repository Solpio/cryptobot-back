import { Bot, InlineKeyboard } from "grammy";
import { getUserByTg } from "../dao/user/getUserByTg";
import { createUser } from "../dao/user/createUser";
import { createUserPhoto } from "../dao/userPhoto/createUserPhoto";
import { User } from "@prisma/client";
import { getUserPhotoByUser } from "../dao/userPhoto/getUserPhotoByUser";
import { updateUserPhoto } from "../dao/userPhoto/updateUserPhoto";

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
  if (userData && userPhotos) {
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
  const keyboard = new InlineKeyboard().webApp("Открыть Web App", webAppUrl);
  await ctx.reply("Нажмите кнопку ниже, чтобы открыть Web App:", {
    reply_markup: keyboard,
  });
});
