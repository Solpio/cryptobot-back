import { createHash, createHmac } from "crypto";

export const checkSignature = (
  token: string,
  { body, headers }: { body: any; headers: any },
) => {
  const secret = createHash("sha256").update(token).digest();
  const checkString = JSON.stringify(body);
  const hmac = createHmac("sha256", secret).update(checkString).digest("hex");
  const signature = headers["crypto-pay-api-signature"];
  return hmac === signature;
};
