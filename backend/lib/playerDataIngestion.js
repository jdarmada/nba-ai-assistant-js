import fs from 'fs';
import readline from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';
import { elasticClient } from './elasticClient.js';

const indexName = 'sample-nba-player-data'; //Replace with your preferred index name

//Since we are using ES modules __dirname and __filename don't exist, so this is a workaround that allows us to use the absolute file path for our sample data.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.resolve(__dirname, '../data/sample_nba_data.csv');

// Function to create an index with mappings
async function createIndex() {
    try {
        // Check if the index already exists
        const exists = await elasticClient.indices.exists({ index: indexName });

        if (exists) {
            console.log(`Index "${indexName}" already exists, create a different index or delete this one.`);
            return;
        }
        // Create the index with mappings
        const response = await elasticClient.indices.create({
            index: indexName,
            body: {
                mappings: {
                    dynamic: 'strict', // Prevent dynamic mapping
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

    //Skip the header line
    let headerLine = true;
    for await (const line of rl) {
        if (headerLine) {
            headerLine = false;
            continue;
        }

        // Split the line by comma and remove whitespace
        const [
            game_id,
            game_date,
            player_id,
            player_full_name,
            player_team_id,
            player_team_name,
            home_team,
            opponent_team_id,
            opponent_team_name,
            points,
            rebounds,
            assists,
            steals,
            blocks,
            fg_percentage,
            minutes_played,
        ] = line.split(',');

        // Create a document object
        const document = {
            game_id: parseInt(game_id),
            game_date: game_date.trim(),
            player_id: parseInt(player_id),
            player_full_name: player_full_name.trim(),
            player_team_id: parseInt(player_team_id),
            player_team_name: player_team_name.trim(),
            home_team: home_team.trim() === 'True', // Converts True/False into a boolean
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

        if(response.errors){
            console.log('Bulk Ingestion Failed:',response.errors)
        } else {
            console.log(`Bulk Ingestion successful. Indexed ${response.items.length} documents. `)
        }
    } catch (error) {
        console.error('Error performing bulk ingestion:', error);
    }
}

//Call the createIndex function
createIndex()

// Call the bulk ingestion function
bulkIngestCsv(filePath);
