import { createHash, createHmac } from "crypto";

const checkSignature = (token, { body, headers }) => {
  const secret = createHash("sha256").update(token).digest();
  const checkString = JSON.stringify(body);
  const hmac = createHmac("sha256", secret).update(checkString).digest("hex");
  // return hmac === signature["crypto-pay-api-signature"];
};
