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
    const player1 = getPlayerInfo(player1Name);
    const player2 = getPlayerInfo(player2Name);

    //Get upcoming matchups
    const player1NextGame = getUpcomingMatchups(player1.team_id)[0];
    const player2NextGame = getUpcomingMatchups(player2.team_id)[0];

    //Get season and historical averages against next opponent for player 1
    const player1SeasonAverages = await getSeasonAveragesAgainstOpponent(
        player1.player_id,
        player1NextGame.opponent_team_id
    );
    const player1HistoricalAverages =
        await getHistoricalAveragesAgainstOpponent(
            player1.player_id,
            player1NextGame.opponent_team_id
        );

    //Get season and historical averages against next opponent for player 2
    const player2SeasonAverages = await getSeasonAveragesAgainstOpponent(
        player2.player_id,
        player2NextGame.opponent_team_id
    );
    const player2HistoricalAverages =
        await getHistoricalAveragesAgainstOpponent(
            player2.player_id,
            player2NextGame.opponent_team_id
        );

    //Storing and consolidating our data into a result variable
    const result = {
        player1: {
            name: player1Name,
            playerId: player1.player_id,
            teamId: player1.team_id,
            nextOpponent: {
                teamId: player1NextGame.opponent_team_id,
                teamName: player1NextGame.opponent_team_name,
                home: player1NextGame.home,
            },
            stats: {
                seasonAverages: player1SeasonAverages,
                historicalAverages: player1HistoricalAverages,
            },
        },
        player2: {
            name: player2Name,
            playerId: player2.player_id,
            teamId: player2.team_id,
            nextOpponent: {
                teamId: player2NextGame.opponent_team_id,
                teamName: player2NextGame.opponent_team_name,
                home: player2NextGame.home,
            },
            stats: {
                seasonAverages: player2SeasonAverages,
                historicalAverages: player2HistoricalAverages,
            },
        },
    };

    return result;
}
