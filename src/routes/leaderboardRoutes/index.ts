import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getLeaderboard } from "../../dao/user/getLeaderboard";

export async function leaderboardRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/leaderboard",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const leaderBoard = await getLeaderboard();
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
