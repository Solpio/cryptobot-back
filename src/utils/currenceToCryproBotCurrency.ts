import { CryptoCurrencyCode } from "crypto-bot-api";
import { CurrencyAsset } from "@prisma/client";

export const currencyToCryptoBotCurrency = (
  currency: CurrencyAsset | null,
): CryptoCurrencyCode => {
  switch (currency) {
    case CurrencyAsset.BNB:
      return "BNB";
    case CurrencyAsset.BTC:
      return "BTC";
    case CurrencyAsset.ETH:
      return "ETH";
    case CurrencyAsset.JET:
      return "JET";
    case CurrencyAsset.LTC:
      return "LTC";
    case CurrencyAsset.TON:
      return "TON";
    case CurrencyAsset.TRX:
      return "TRX";
    case CurrencyAsset.USDC:
      return "USDC";
    case CurrencyAsset.USDT:
      return "USDT";
    default:
      return "USDT";
  }
};
