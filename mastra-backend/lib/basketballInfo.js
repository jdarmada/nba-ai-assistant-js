import { playersByName } from '../data/playerAndTeamInfo.js';
import { teamsByName } from '../data/playerAndTeamInfo.js';
import { upcomingMatchups } from '../data/playerAndTeamInfo.js';
import { getHistoricalAveragesAgainstOpponent } from './elasticAggs.js';
import { getSeasonAveragesAgainstOpponent } from './elasticAggs.js';

export function getPlayerInfo(playerFullName) {
  return playersByName[playerFullName];
}

export function getTeamID(teamFullName) {
  return teamsByName[teamFullName];
}

export function getUpcomingMatchups(teamId) {
  return upcomingMatchups[teamId];
}

export async function comparePlayersForNextMatchup(player1Name, player2Name) {
  //Get Player Info
  const player1Info = getPlayerInfo(player1Name);
  const player2Info = getPlayerInfo(player2Name);

  //Get upcoming matchups
  const player1NextGame = getUpcomingMatchups(player1Info.team_id)[0];
  const player2NextGame = getUpcomingMatchups(player2Info.team_id)[0];

  //Get season and historical averages against next opponent for player 1
  const player1SeasonAverages = await getSeasonAveragesAgainstOpponent(
    player1Info.player_id,
    player1NextGame.opponent_team_id
  );
  const player1HistoricalAverages = await getHistoricalAveragesAgainstOpponent(
    player1Info.player_id,
    player1NextGame.opponent_team_id
  );

  //Get season and historical averages against next opponent for player 2
  const player2SeasonAverages = await getSeasonAveragesAgainstOpponent(
    player2Info.player_id,
    player2NextGame.opponent_team_id
  );
  const player2HistoricalAverages = await getHistoricalAveragesAgainstOpponent(
    player2Info.player_id,
    player2NextGame.opponent_team_id
  );

  const player1 = {
    name: player1Name,
    playerId: player1Info.player_id,
    teamId: player1Info.team_id,
    nextOpponent: {
      teamId: player1NextGame.opponent_team_id,
      teamName: player1NextGame.opponent_team_name,
      home: player1NextGame.home,
    },
    stats: {
      seasonAverages: player1SeasonAverages,
      historicalAverages: player1HistoricalAverages,
    },
  };

  const player2 = {
    name: player2Name,
    playerId: player2Info.player_id,
    teamId: player2Info.team_id,
    nextOpponent: {
      teamId: player2NextGame.opponent_team_id,
      teamName: player2NextGame.opponent_team_name,
      home: player2NextGame.home,
    },
    stats: {
      seasonAverages: player2SeasonAverages,
      historicalAverages: player2HistoricalAverages,
    },
  };

  const result = generateComparisonDetails(player1, player2);

  console.log(result);

  return result;
}

function generateComparisonDetails(player1, player2 ) {
  return `
  Player Comparison:
  
  ${player1.name}
  - Next Game: ${player1.nextOpponent.home ? 'Home' : 'Away'} vs ${player1.nextOpponent.teamName}
  - Season Averages vs ${player1.nextOpponent.teamName}: ${player1.stats.seasonAverages.points.toFixed(1)} pts, ${player1.stats.seasonAverages.rebounds.toFixed(1)} reb, ${player1.stats.seasonAverages.assists.toFixed(1)} ast, ${player1.stats.seasonAverages.steals.toFixed(1)} stl, ${player1.stats.seasonAverages.blocks.toFixed(1)} blk, ${(player1.stats.seasonAverages.fgPercentage * 100).toFixed(1)}% FG
  - Historical Averages: ${player1.stats.historicalAverages.points.toFixed(1)} pts, ${player1.stats.historicalAverages.rebounds.toFixed(1)} reb, ${player1.stats.historicalAverages.assists.toFixed(1)} ast, ${player1.stats.historicalAverages.steals.toFixed(1)} stl, ${player1.stats.historicalAverages.blocks.toFixed(1)} blk, ${(player1.stats.historicalAverages.fgPercentage * 100).toFixed(1)}% FG
  
  ${player2.name}
  - Next Game: ${player2.nextOpponent.home ? 'Home' : 'Away'} vs ${player2.nextOpponent.teamName}
  - Season Averages vs ${player2.nextOpponent.teamName}: ${player2.stats.seasonAverages.points.toFixed(1)} pts, ${player2.stats.seasonAverages.rebounds.toFixed(1)} reb, ${player2.stats.seasonAverages.assists.toFixed(1)} ast, ${player2.stats.seasonAverages.steals.toFixed(1)} stl, ${player2.stats.seasonAverages.blocks.toFixed(1)} blk, ${(player2.stats.seasonAverages.fgPercentage * 100).toFixed(1)}% FG
  - Historical Averages: ${player2.stats.historicalAverages.points.toFixed(1)} pts, ${player2.stats.historicalAverages.rebounds.toFixed(1)} reb, ${player2.stats.historicalAverages.assists.toFixed(1)} ast, ${player2.stats.historicalAverages.steals.toFixed(1)} stl, ${player2.stats.historicalAverages.blocks.toFixed(1)} blk, ${(player2.stats.historicalAverages.fgPercentage * 100).toFixed(1)}% FG
  `;
}

comparePlayersForNextMatchup('LeBron James', 'Stephen Curry');
