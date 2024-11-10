import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifySchema,
} from "fastify";
import { getIdByToken } from "../../utils/auth";
import { getUserByTg } from "../../dao/user/getUserByTg";
import { getUser } from "../../dao/user/getUser";
import { getUserHistory } from "../../dao/ownerHistory/getUserHistory";
import { createUser, ICreateUser } from "../../dao/user/createUser";

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

interface GetUserHistoryParams {
  userId: string;
}

const getUserHistoryParamsSchema: FastifySchema = {
  params: {
    type: "object",
    properties: {
      userId: { type: "string" }, // `id` — обязательный параметр типа string
    },
    required: ["userId"],
  },
};

interface IRegisterUserBody {
  tgId: number;
  username?: string;
  languageCode?: string;
  firstName: string;
  lastName?: string;
}

const getRegisterUserBodySchema: FastifySchema = {
  body: {
    type: "object",
    properties: {
      tgId: { type: "number" },
      username: { type: "string" },
      languageCode: { type: "string" },
      firstName: { type: "string" },
      lastName: { type: "string" },
    },
    required: ["tgId"],
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
  fastify.get<{ Params: GetUserHistoryParams }>(
    `/user/:userId/history`,
    { schema: getUserHistoryParamsSchema },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { userId } = request.params as GetUserHistoryParams;

      const purchaseHistory = await getUserHistory(userId);

      reply.status(200).send(purchaseHistory);
    },
  );
  fastify.post<{ Body: IRegisterUserBody }>(
    `/user/register`,
    { schema: getRegisterUserBodySchema },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const body = request.body as IRegisterUserBody;
      const userId = +getIdByToken(request.headers.authorization || "");
      const userExist = await getUserByTg(userId);

      if (userExist) {
        return reply.status(200).send({ message: "User already exist" });
      }

      const userDto: ICreateUser = {
        tgId: body.tgId,
        username: body.username ? body.username : null,
        languageCode: body.languageCode ? body.languageCode : null,
        firstName: body.firstName ? body.firstName : null,
        lastName: body.lastName ? body.lastName : null,
      };
      const user = await createUser(userDto);

      reply.status(200).send(user);
    },
  );
}
