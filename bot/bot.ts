import { Bot } from "grammy";
import { getUser } from "../src/dao/user/getUser";
import { createUser } from "../src/dao/user/createUser";
import { createUserPhoto } from "../src/dao/userPhoto/createUserPhoto";
import { User } from "@prisma/client";

export const bot = new Bot(process.env.BOT_TOKEN ?? "");

bot.command("start", async (ctx) => {
  let userData: User | null = null;
  if (ctx.from) {
    const existUser = await getUser(ctx.from.id);

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

  // const photoSizes = ctx.message?.photo;
  const userPhotos = await ctx.api.getUserProfilePhotos(ctx.from?.id || 0);
  if (userData && userPhotos) {
    const largestPhoto = userPhotos.photos[0][userPhotos.photos[0].length - 1];
    const fileUrl = await ctx.api
      .getFile(largestPhoto.file_id)
      .then(
        (file) =>
          `https://api.telegram.org/file/bot${ctx.api.token}/${file.file_path}`,
      );

    await createUserPhoto({
      fileId: largestPhoto.file_id,
      photoUrl: fileUrl,
      userId: userData.id,
    });
  }
});
