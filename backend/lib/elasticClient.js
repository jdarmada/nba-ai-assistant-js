import { Client } from '@elastic/elasticsearch';

//Elastic Initialization
const config = {
    node: `${process.env.ELASTIC_ENDPOINT}`,
    auth: {
        apiKey: `${process.env.ELASTIC_API_KEY}`,
    },
};

export const elasticClient = new Client(config);

const indexName = 'career-stats';

export async function checkIndex(indexName) {
    //Check if index exists
    if (indexName && (await elasticClient.indices.exists({ index: indexName }))) {
        return;
    } else {
        //Create index
        await elasticClient.indices.create({ index: indexName });
    }
}

