import { getPlayerInfo, getNextUpcomingMatchup } from './basketballStatsApi';
import { getAverages } from './elasticAggs';
import { teamsByName } from './data';



export async function compareFantasyPlayers(player1Name, player2Name){
  try {

    const player1Info = await getPlayerInfo(player1Name);

    const player2Info = await getPlayerInfo(player2Name);

    const [player1Id, player1TeamId] = player1Info;
    
    const [player2Id, player2TeamId] = player2Info;

    // Get next matchups
    const player1NextGame = await getNextUpcomingMatchup(player1TeamId);

    const player2NextGame = await getNextUpcomingMatchup(player2TeamId);

    const player1OpponentId = teamsByName[player1NextGame.opponent]

    const player2OpponentId = teamsByName[player2NextGame.opponent]

    // Get player averages against these opponents
    const player1Stats = await getAverages(player1Id, player1OpponentId);

    const player2Stats = await getAverages(player2Id, player2OpponentId);


    // Create comparison result
    const result = {
      player1: {
        name: player1Name,
        playerId: player1Id,
        teamId: player1TeamId,
        nextOpponent: {
          teamId: player1OpponentId,
          teamName: player1NextGame.opponent,
          gameDate: player1NextGame.date,
          location: player1NextGame.location
        },
        stats: {
          seasonAverages: player1Stats.seasonAverages,
          historicalAverages: player1Stats.historicalAverages,
        }
      },
      player2: {
        name: player2Name,
        playerId: player2Id,
        teamId: player2TeamId,
        nextOpponent: {
          teamId: player2OpponentId,
          teamName: player2NextGame.opponent,
          gameDate: player2NextGame.date,
          location: player2NextGame.location
        },
        stats: {
          seasonAverages: player2Stats.seasonAverages,
          historicalAverages: player2Stats.historicalAverages,
        }
      },
      details: generateComparisonDetails(
        player1Name, player1NextGame, player1Stats,
        player2Name, player2NextGame, player2Stats
      )
    };

    return result;
  } catch (error) {
    console.error('Error comparing players:', error);
    return { error: 'Failed to compare players. Please try again.' };
  }
}


// Tried to change prompt instructions to format better but found that adding this function is an easier way with more control.

function generateComparisonDetails(player1Name, player1Game, player1Stats, player2Name, player2Game, player2Stats,) {
  return `
Fantasy Basketball Comparison:

${player1Name}
- Next Game: ${player1Game.venueDetails} on ${new Date(player1Game.date).toLocaleDateString()}
- Season Averages vs ${player1Game.opponent}: ${player1Stats.seasonAverages.points.toFixed(1)} pts, ${player1Stats.seasonAverages.rebounds.toFixed(1)} reb, ${player1Stats.seasonAverages.assists.toFixed(1)} ast, ${player1Stats.seasonAverages.steals.toFixed(1)} stl, ${player1Stats.seasonAverages.blocks.toFixed(1)} blk, ${(player1Stats.seasonAverages.fgPercentage * 100).toFixed(1)}% FG
- Historical Averages: ${player1Stats.historicalAverages.points.toFixed(1)} pts, ${player1Stats.historicalAverages.rebounds.toFixed(1)} reb, ${player1Stats.historicalAverages.assists.toFixed(1)} ast, ${player1Stats.historicalAverages.steals.toFixed(1)} stl, ${player1Stats.historicalAverages.blocks.toFixed(1)} blk, ${(player1Stats.historicalAverages.fgPercentage * 100).toFixed(1)}% FG

${player2Name}
- Next Game: ${player2Game.venueDetails} on ${new Date(player2Game.date).toLocaleDateString()}
- Season Averages vs ${player2Game.opponent}: ${player2Stats.seasonAverages.points.toFixed(1)} pts, ${player2Stats.seasonAverages.rebounds.toFixed(1)} reb, ${player2Stats.seasonAverages.assists.toFixed(1)} ast, ${player2Stats.seasonAverages.steals.toFixed(1)} stl, ${player2Stats.seasonAverages.blocks.toFixed(1)} blk, ${(player2Stats.seasonAverages.fgPercentage * 100).toFixed(1)}% FG
- Historical Averages: ${player2Stats.historicalAverages.points.toFixed(1)} pts, ${player2Stats.historicalAverages.rebounds.toFixed(1)} reb, ${player2Stats.historicalAverages.assists.toFixed(1)} ast, ${player2Stats.historicalAverages.steals.toFixed(1)} stl, ${player2Stats.historicalAverages.blocks.toFixed(1)} blk, ${(player2Stats.historicalAverages.fgPercentage * 100).toFixed(1)}% FG
`;
}