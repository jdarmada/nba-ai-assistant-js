import { elasticClient } from './elasticClient.js';

export async function getSeasonAveragesAgainstOpponent(player_id, opponent_team_id) {
  try {
    // Query for season averages
    const seasonQuery = await elasticClient.search({
      index: 'sample-nba-player-data',
      size: 0,
      query: {
        bool: {
          must: [
            {
              term: {
                player_id: {
                  value: player_id,
                },
              },
            },
            {
              term: {
                opponent_team_id: {
                  value: opponent_team_id,
                },
              },
            },
            {
              range: {
                //Range for this season
                game_date: {
                  gte: '2024-10-01',
                  lte: '2025-06-30',
                },
              },
            },
          ],
        },
      },
      aggs: {
        avg_points: { avg: { field: 'points' } },
        avg_rebounds: { avg: { field: 'rebounds' } },
        avg_assists: { avg: { field: 'assists' } },
        avg_steals: { avg: { field: 'steals' } },
        avg_blocks: { avg: { field: 'blocks' } },
        avg_fg_percentage: { avg: { field: 'fg_percentage' } },
      },
    });

    return {
      points: seasonQuery.aggregations.avg_points.value || 0,
      rebounds: seasonQuery.aggregations.avg_rebounds.value || 0,
      assists: seasonQuery.aggregations.avg_assists.value || 0,
      steals: seasonQuery.aggregations.avg_steals.value || 0,
      blocks: seasonQuery.aggregations.avg_blocks.value || 0,
      fgPercentage: seasonQuery.aggregations.avg_fg_percentage.value || 0,
    };
  } catch (error) {
    console.error('Query error from getSeasonAveragesAgainstOpponent function:', error);
    return { error: 'Queries failed in getting season averages against opponent.' };
  }
}

export async function getHistoricalAveragesAgainstOpponent(player_id, opponent_team_id) {
  try {
    //Query for Historical Averages
    const historicalQuery = await elasticClient.search({
      index: 'sample-nba-player-data',
      size: 0,
      query: {
        bool: {
          must: [
            {
              term: {
                player_id: {
                  value: player_id,
                },
              },
            },
            {
              term: {
                opponent_team_id: {
                  value: opponent_team_id,
                },
              },
            },
          ],
        },
      },
      aggs: {
        avg_points: { avg: { field: 'points' } },
        avg_rebounds: { avg: { field: 'rebounds' } },
        avg_assists: { avg: { field: 'assists' } },
        avg_steals: { avg: { field: 'steals' } },
        avg_blocks: { avg: { field: 'blocks' } },
        avg_fg_percentage: { avg: { field: 'fg_percentage' } },
      },
    });

    return {
      points: historicalQuery.aggregations.avg_points.value || 0,
      rebounds: historicalQuery.aggregations.avg_rebounds.value || 0,
      assists: historicalQuery.aggregations.avg_assists.value || 0,
      steals: historicalQuery.aggregations.avg_steals.value || 0,
      blocks: historicalQuery.aggregations.avg_blocks.value || 0,
      fgPercentage: historicalQuery.aggregations.avg_fg_percentage.value || 0,
    };
  } catch (error) {
    console.error('Query error from getHistoricalAveragesAgainstOpponent function:', error);
    return { error: 'Queries failed in getting historical averages against opponent.' };
  }
}

export async function getSeasonAverages(player_id) {
  try {
    // Query for season averages
    const seasonQuery = await elasticClient.search({
      index: 'sample-nba-player-data',
      size: 0,
      query: {
        bool: {
          must: [
            {
              term: {
                player_id: {
                  value: player_id,
                },
              },
            },
            {
              range: {
                //Range for this season
                game_date: {
                  gte: '2024-10-01',
                  lte: '2025-06-30',
                },
              },
            },
          ],
        },
      },
      aggs: {
        avg_points: { avg: { field: 'points' } },
        avg_rebounds: { avg: { field: 'rebounds' } },
        avg_assists: { avg: { field: 'assists' } },
        avg_steals: { avg: { field: 'steals' } },
        avg_blocks: { avg: { field: 'blocks' } },
        avg_fg_percentage: { avg: { field: 'fg_percentage' } },
      },
    });

    return {
      points: seasonQuery.aggregations.avg_points.value || 0,
      rebounds: seasonQuery.aggregations.avg_rebounds.value || 0,
      assists: seasonQuery.aggregations.avg_assists.value || 0,
      steals: seasonQuery.aggregations.avg_steals.value || 0,
      blocks: seasonQuery.aggregations.avg_blocks.value || 0,
      fgPercentage: seasonQuery.aggregations.avg_fg_percentage.value || 0,
    };
  } catch (error) {
    console.error('Query error from getSeasonAverages function:', error);
    return { error: 'Queries failed in getting season averages.' };
  }
}

export async function getHistoricalAverages(player_id) {
  try {
    //Query for Historical Averages
    const historicalQuery = await elasticClient.search({
      index: 'sample-nba-player-data',
      size: 0,
      query: {
        bool: {
          must: [
            {
              term: {
                player_id: {
                  value: player_id,
                },
              },
            },
          ],
        },
      },
      aggs: {
        avg_points: { avg: { field: 'points' } },
        avg_rebounds: { avg: { field: 'rebounds' } },
        avg_assists: { avg: { field: 'assists' } },
        avg_steals: { avg: { field: 'steals' } },
        avg_blocks: { avg: { field: 'blocks' } },
        avg_fg_percentage: { avg: { field: 'fg_percentage' } },
      },
    });

    return {
      points: historicalQuery.aggregations.avg_points.value || 0,
      rebounds: historicalQuery.aggregations.avg_rebounds.value || 0,
      assists: historicalQuery.aggregations.avg_assists.value || 0,
      steals: historicalQuery.aggregations.avg_steals.value || 0,
      blocks: historicalQuery.aggregations.avg_blocks.value || 0,
      fgPercentage: historicalQuery.aggregations.avg_fg_percentage.value || 0,
    };
  } catch (error) {
    console.error('Query error from getHistoricalAverages function:', error);
    return { error: 'Queries failed in getting historical averages.' };
  }
}
