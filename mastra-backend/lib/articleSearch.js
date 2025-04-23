import { elasticClient } from './elasticClient.js';
import { playersByName } from '../data/playerAndTeamInfo.js';

// Performs semantic search to find the top articles for the given player and their team
async function findRelevantArticles(playerName, teamName) {
    try {
        const searchResults = await elasticClient.search({
            index: process.env.ARTICLE_INDEX, // Index containing articles + embeddings
            size: 2, // Number of articles to return
            query: {
                semantic: {
                    field: process.env.SEMANTIC_FIELD, // Semantic field name in mapping
                    query: `Recent articles about ${playerName} and his team ${teamName}`, // Natural language phrasing is best for semantic queries
                },
            },
        });

        // Sort articles by date, most recent first
        const sortedArticles = searchResults.hits.hits.sort(
            (a, b) => new Date(b._source.Date) - new Date(a._source.Date)
        );

        return sortedArticles;
    } catch (error) {
        console.error(`Error during semantic search for ${playerName} (${teamName}):`, error);
        return []; // Return an empty array if the search fails
    }
}

// Main function used by the 'articleSemanticSearch' agent tool.
export async function getArticles(player1, player2) {
    try {
        const player1Team = playersByName[player1].team_name;
        const player2Team = playersByName[player2].team_name;

        const player1Articles = await findRelevantArticles(player1, player1Team);
        const player2Articles = await findRelevantArticles(player2, player2Team);

        return {
            player1: {
                name: player1,
                articles: player1Articles,
            },
            player2: {
                name: player2,
                articles: player2Articles,
            },
        };
    } catch (error) {
        console.error('Error retrieving articles for players:', error);
        return {
            player1: {
                name: player1,
                articles: [],
            },
            player2: {
                name: player2,
                articles: [],
            },
        };
    }
}
