import fs from 'fs'
import readline from 'readline'
import { elasticClient } from "./elasticClient.js";

const indexName = process.env.PLAYER_DATA_INDEX;

async function createIndex() {
    try {
  
      // Create the index with mappings
      const response = await elasticClient.indices.create({
        index: indexName, //Replace with your index name
        body: {
          mappings: {
            properties: {
              game_id: { type: 'integer' },
              game_date: { type: 'date' },
              player_id: { type: 'integer' },
              player_full_name: { type: 'text' },
              player_team_id: { type: 'integer' },
              player_team_name: { type: 'text' },
              home_team: { type: 'boolean' },
              opponent_team_id: { type: 'integer' },
              opponent_team_name: { type: 'text' },
              points: { type: 'float' },
              rebounds: { type: 'float' },
              assists: { type: 'float' },
              steals: { type: 'float' },
              blocks: { type: 'float' },
              fg_percentage: { type: 'float' },
              minutes_played: { type: 'float' },
            },
          },
        },
      });
  
      console.log('Index created:', response);
    } catch (error) {
      console.error('Error creating index:', error);
    }
  }

  async function bulkIngestCsv(filePath) { 
    const readStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: readStream,
      crlfDelay: Infinity,
    });
  
    const bulkBody = [];
  
    for await (const line of rl) {
      const [game_id, game_date, player_id, player_full_name, player_team_id, player_team_name, home_team, opponent_team_id, opponent_team_name, points, rebounds, assists, steals, blocks, fg_percentage, minutes_played] = line.split(',');
  
      const document = {
        game_id: parseInt(game_id),
        game_date: game_date.trim(),
        player_id: parseInt(player_id),
        player_full_name: player_full_name.trim(),
        player_team_id: parseInt(player_team_id),
        player_team_name: player_team_name.trim(),
        home_team: home_team.trim() === 'True', // Converts 'True'/'False' into a boolean
        opponent_team_id: parseInt(opponent_team_id),
        opponent_team_name: opponent_team_name.trim(),
        points: parseFloat(points),
        rebounds: parseFloat(rebounds),
        assists: parseFloat(assists),
        steals: parseFloat(steals),
        blocks: parseFloat(blocks),
        fg_percentage: parseFloat(fg_percentage),
        minutes_played: parseFloat(minutes_played),
      };
  
      // Prepare the bulk operation format
      bulkBody.push({ index: { _index: indexName } });
      bulkBody.push(document);
    }
  
    try {
      // Perform the bulk request
      const response = await elasticClient.bulk({ body: bulkBody });
  
    } catch (error) {
      console.error('Error performing bulk ingestion:', error);
    }
  }
  
  // Call the bulk ingestion function
  bulkIngestCsv();