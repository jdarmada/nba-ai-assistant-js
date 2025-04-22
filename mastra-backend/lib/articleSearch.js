import { elasticClient } from './elasticClient.js';
import { playersByName } from '../data/playerAndTeamInfo.js';



async function findRelevantArticles(playerName, teamName) {
  const searchResults = await elasticClient.search({
    index: 'elser-index3',
    size: 2,
    query: {
      semantic: {
        field: 'inference_field',
        query: `Recent articles about ${playerName} and his team ${teamName}`,
      },
    },
  });

  const sortedArticles = searchResults.hits.hits.sort((a, b) => new Date(b._source.Date) - new Date(a._source.Date));

  return sortedArticles;
}

export async function getArticles(player1, player2) {
  const player1Team = playersByName[player1].team_name
  const player2Team = playersByName[player2].team_name

  const player1Articles = await findRelevantArticles(player1, player1Team);
  const player2Articles = await findRelevantArticles(player2, player2Team);

  const results = {
    player1: {
        name: player1,
        articles: player1Articles
    },
    player2: {
        name: player2,
        articles: player2Articles
    }
  }
  return results
}

