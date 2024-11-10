import { FastifyReply, FastifyRequest } from "fastify";
import { checkSignature } from "../utils/checkSignature";

export async function cryptoPayValidationMiddleware(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const body = req.body;
  const result = checkSignature(process.env.CRYPTO_BOT_TOKEN || "", {
    body,
    headers: req.headers,
  });
  console.log(result);
  if (result) {
    return;
  }
  reply.status(401).send({ message: "Bad check signature result" });
}
