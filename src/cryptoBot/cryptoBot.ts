import CryptoBotAPI from "crypto-bot-api";

export const cryptoBotClient = new CryptoBotAPI(
  process.env.CRYPTO_BOT_TOKEN || "",
  "testnet",
);
