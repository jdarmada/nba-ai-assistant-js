import { elasticClient, checkIndex } from './elasticClient';
import { teams } from './data';
import {
    ApiResponse,
    ErrorResult,
    Game,
    GameStats,
    GameResult,
    Team,
} from './types';

// Initial Fetch and Ingestion for Player Game Data from API into Elastic Index

async function fetchAllGames(player_id) {
    let allGames = [];
    let nextCursor = null;

    while (true) {
        let url = `https://api.balldontlie.io/v1/stats?player_ids[]=${player_id}&per_page=100`;

        if (nextCursor) {
            url += `&cursor=${nextCursor}`;
        }

        const response = await fetch(url, {
            headers: {
                Authorization: `${process.env.NBA_STATS_API_KEY}`,
            },
        });

        if (response.ok) {
            const data = await response.json();

            const games = data.data.map((game) => ({
                game_id: game.game.id,
                game_date: game.game.date,
                player_id: game.player.id,
                player_full_name: `${game.player.first_name} ${game.player.last_name}`,
                player_team_id: game.team.id,
                player_team_name: game.team.full_name,
                home_team: game.game.home_team_id === game.team.id,
                opponent_team_id:
                    game.game.home_team_id === game.team.id
                        ? game.game.visitor_team_id
                        : game.game.home_team_id,
                opponent_team_name:
                    teams[
                        game.game.home_team_id === game.team.id
                            ? game.game.visitor_team_id
                            : game.game.home_team_id
                    ],
                points: game.pts,
                rebounds: game.reb,
                assists: game.ast,
                steals: game.stl,
                blocks: game.blk,
                fg_percentage: game.fg_pct,
                minutes_played: game.min,
            }));

            allGames = allGames.concat(games);

            // Check if there is a next_cursor for pagination
            if (data.meta.next_cursor) {
                nextCursor = data.meta.next_cursor;
            } else {
                break;
            }
        } else {
            console.error('Error:', response.status, response.statusText);
            return [];
        }
    }

    return allGames;
}

async function storeAllGames(player_id) {
    const elasticIndex = 'career-stats';

    await checkIndex(elasticIndex);

    // Check if player already exists in index
    const playerCheck = await elasticClient.search({
        index: 'career-stats',
        query: {
            match: {
                player_id: player_id,
            },
        },
    });

    if (playerCheck.hits.hits.length > 0) {
        console.log(
            `Player already found in index: ${elasticIndex}, stopping ingestion. Please enter another Player ID`
        );
        return;
    }

    const careerGames = await fetchAllGames(player_id);

    if (!careerGames || !careerGames.length) {
        console.log('No career games found');
        return;
    }

    const bulkResponse = await elasticClient.helpers.bulk({
        datasource: careerGames,

        onDocument(doc) {
            return {
                index: { _index: 'career-stats' },
            };
        },
    });
    const itemCount = await elasticClient.count({ index: 'career-stats' });
}

// Functions to grab player/matchup info

export async function getPlayerInfo(playerName) {
    const nameParts = playerName.trim().split(/\s+/);
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join('');

    try {
        const response = await fetch(
            `https://api.balldontlie.io/v1/players?first_name=${first_name}&last_name=${last_name}`,
            {
                headers: {
                    Authorization: `${process.env.NBA_STATS_API_KEY}`,
                },
            }
        );
        if (response.ok) {
            const data = await response.json();

            const player = data.data[0];
            console.log(player);

            return [player.id, player.team.id];
        }
    } catch (error) {
        console.error(error);
    }
}

export async function getNextUpcomingMatchup(teamId) {
    // Get current date
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];

    // Get current time in hours and minutes
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();

    // Fetch upcoming games for the specified team
    const url = `https://api.balldontlie.io/v1/games?team_ids[]=${teamId}&start_date=${formattedToday}`;

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `${process.env.NBA_STATS_API_KEY}`,
            },
        });

        if (!response.ok) {
            return { error: `Error fetching games: ${response.statusText}` };
        }

        const data = await response.json();

        if (!data.data || data.data.length === 0) {
            return { error: 'No upcoming games found for this team.' };
        }

        // Sort games
        const sortedGames = data.data.sort((a, b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        });

        // Find the first game that hasn't started yet
        for (const game of sortedGames) {
            const gameDate = new Date(game.date);
            const gameHour = gameDate.getHours();
            const gameMinute = gameDate.getMinutes();

            const isGameToday =
                gameDate.toISOString().split('T')[0] === formattedToday;

            // Check if game has started
            if (isGameToday) {
                if (
                    currentHour < gameHour ||
                    (currentHour === gameHour && currentMinute < gameMinute)
                ) {
                    return formatGameResponse(game, teamId);
                }
            } else {
                return formatGameResponse(game, teamId);
            }
        }

        return { error: 'No upcoming games' };
    } catch (error) {
        return { error: `Error fetching games` };
    }
}

function formatGameResponse(game, teamId) {
    const isHomeTeam = game.home_team.id === teamId;
    const team = isHomeTeam ? game.home_team : game.visitor_team;
    const opponent = isHomeTeam ? game.visitor_team : game.home_team;

    return {
        gameId: game.id,
        date: game.date,
        status: game.status,
        season: game.season,
        team: team.full_name,
        opponent: opponent.full_name,
        location: isHomeTeam ? 'home' : 'away',
        venueDetails: `${isHomeTeam ? 'vs' : '@'} ${opponent.full_name}`,
    };
}
