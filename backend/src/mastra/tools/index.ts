// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { comparePlayersForNextMatchup } from '../../../lib/comparePlayers.js'
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const playerComparisonTool = createTool({
    id: "Compare two NBA players",
    inputSchema: z.object({
        player1:z.string(),
        player2:z.string()
    }),
    description: "Use this tool to compare two players given in the user prompt.",
    execute: async ({ context: { player1, player2 } }) => {
        return await comparePlayersForNextMatchup(player1, player2);
      },
})

    