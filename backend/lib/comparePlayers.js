import { playersByName } from '../data/playerAndTeamInfo.js';
import { teamsByName } from '../data/playerAndTeamInfo.js';
import { upcomingMatchups } from '../data/playerAndTeamInfo.js';
import { getHistoricalAveragesAgainstOpponent } from './elasticAggs.js';
import { getSeasonAveragesAgainstOpponent } from './elasticAggs.js';

//Simple helper functions to simulate API calls for player and team metadata. These reference the hardcoded values from playerAndTeamInfo.js in the data directory
export function getPlayerInfo(playerFullName) {
    return playersByName[playerFullName];
}

export function getTeamID(teamFullName) {
    return teamsByName[teamFullName];
}

export function getUpcomingMatchups(teamId) {
    return upcomingMatchups[teamId];
}

//Main function used by the 'playerComparisonTool' agent tool
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

    return [player1, player2];
}
