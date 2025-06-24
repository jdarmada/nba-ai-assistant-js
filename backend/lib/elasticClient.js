import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Client } from '@elastic/elasticsearch';

// Grab current directory and load .env from backend folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '../.env');

// Load environment variables from the correct path
config({ path: envPath });

//Elastic client Initialization, make sure environment variables are being loaded in correctly
const clientConfig = {
    node: `${process.env.ELASTIC_ENDPOINT}`,
    auth: {
        apiKey: `${process.env.ELASTIC_API_KEY}`,
    },
};

export const elasticClient = new Client(clientConfig);

//Check if the client is connected
async function checkConnection() { 
    try {
        const info = await elasticClient.info;
        console.log('Elasticsearch is connected:', info);
    } catch (error) {
        console.error('Elasticsearch connection error:', error);
    }
}

checkConnection();