import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import { getIdByToken } from "../../utils/auth";
import { getUserByTg } from "../../dao/user/getUserByTg";
import { getUser } from "../../dao/user/getUser";

interface GetUserParams {
  id: string;
}

const getUserParamsSchema: FastifySchema = {
  params: {
    type: "object",
    properties: {
      id: { type: "string" }, // `id` — обязательный параметр типа string
    },
    required: ["id"],
  },
};

export async function userRoutes(fastify: FastifyInstance) {
  fastify.get<{ Params: GetUserParams }>(
    "/user/:id",
    {
      schema: getUserParamsSchema,
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = request.params as GetUserParams;
        // const userId = +getIdByToken(request.headers.authorization || "");
        // const user = await getUserByTg(userId);
        const user = await getUser(id);

        if (!user) {
          return reply.status(404).send({ message: "User not found" });
        }

        return reply.status(200).send(user);
      } catch (error) {
        console.error("Error getting user:", error);
        reply.status(500).send({ error: "Unable to get user" });
      }
    },
  );

  fastify.get(
    "/user/me",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        // const { id } = request.params as GetUserParams;
        const userId = +getIdByToken(request.headers.authorization || "");
        const user = await getUserByTg(userId);
        // const user = await getUser(id);

        if (!user) {
          return reply.status(404).send({ message: "User not found" });
        }

        return reply.status(200).send(user);
      } catch (error) {
        console.error("Error getting user:", error);
        reply.status(500).send({ error: "Unable to get user" });
      }
    },
  );
}
