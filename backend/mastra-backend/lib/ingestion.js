import fs from 'fs'
import csv from 'csv-parser'
import { elasticClient } from "./elasticClient.js";

const historicalFilePath = '/backend/mastra-backend/data/historical-player-data.csv'
const seasonFilePath = '/backend/mastra-backend/data/season-player-data.csv'

async function parseCSVAndIndex(filePath) {
    const bulkBody = [];  // Bulk request body to send to Elasticsearch
  
    fs.createReadStream(filePath)
      .pipe(csv())  // Parsing the CSV
      .on('data', (row) => {
        // Format each row to match Elasticsearch document format
        bulkBody.push({
          index: { _index: indexName, _id: row.id },  // `_id` could be something from your CSV or auto-generated
        });
        bulkBody.push(row);  // The actual document data (row data)
      })
      .on('end', async () => {
        try {
          // Bulk index the data into Elasticsearch
          const { body } = await elasticClient.bulk({ body: bulkBody });
          console.log('Bulk index response:', body);
        } catch (error) {
          console.error('Error indexing documents:', error);
        }
      });
  }
  
  parseCSVAndIndex(historicalFilePath);