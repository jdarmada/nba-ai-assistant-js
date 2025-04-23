import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { elasticClient } from './elasticClient.js';

const FILE_PATH = ''; // File path for sample articles
const INDEX_NAME = process.env.ARTICLE_INDEX; //Index name for sample articles

async function createIndex() {
    try {
        const exists = await elasticClient.indices.exists({ index: INDEX_NAME });

        if (exists) {
            await elasticClient.indices.delete({ index: INDEX_NAME });
            console.log(`Deleted existing index '${INDEX_NAME}'`);
        }

        await elasticClient.indices.create({
            index: INDEX_NAME,
            body: {
                mappings: {
                    properties: {
                        'Article Title': { type: 'text', copy_to: 'inference_field' },
                        Summary: { type: 'text', copy_to: 'inference_field' },
                        inference_field: {
                            // Semantic text field; fields copied here will have embeddings generated
                            type: 'semantic_text',
                            inference_id: '.elser-2-elasticsearch', // ID for the embedding model
                        },
                        Date: { type: 'date' },
                        Team: { type: 'keyword' },
                        Source: { type: 'keyword' },
                        Author: { type: 'keyword' },
                        Tags: { type: 'keyword' },
                    },
                },
            },
        });

        console.log(`Index '${INDEX_NAME}' created.`);
    } catch (error) {
        console.error(`Error creating index '${INDEX_NAME}':`, error);
    }
}

async function ingestCSV(filePath) {
    try {
        const csvText = fs.readFileSync(filePath, 'utf8');
        const records = parse(csvText, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        });

        const bulkOps = [];

        for (const doc of records) {
            bulkOps.push({ index: { _index: INDEX_NAME } }, doc);
        }

        const result = await elasticClient.bulk({ body: bulkOps });

        if (result.errors) {
            console.error('Errors found in bulk ingestion:', result.errors);
        } else {
            console.log(`Successfully indexed ${bulkOps.length / 2} documents.`);
        }
    } catch (error) {
        console.error(`Error ingesting CSV from ${filePath}:`, error);
    }
}

async function main() {
    try {
        await createIndex();
        await ingestCSV(FILE_PATH);
        console.log('Embeddings generated and documents ingested in ES.');
    } catch (err) {
        console.error('Error:', err);
    }
}

main();
