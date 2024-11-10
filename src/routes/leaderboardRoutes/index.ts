import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getLeaderboard } from "../../dao/user/getLeaderboard";

interface IGetLeaderBoardQuery {
  search?: string;
}
export async function leaderboardRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/leaderboard",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { search } = request.query as IGetLeaderBoardQuery;
        const leaderBoard = await getLeaderboard(search);
        if (!leaderBoard) {
          reply.status(500).send({ error: "Unable to get leaderboard" });
        }
        return leaderBoard;
      } catch (error) {
        console.error("Error getting leaderboard:", error);
        reply.status(500).send({ error: "Unable to get leaderboard" });
      }
    },
  );
}
