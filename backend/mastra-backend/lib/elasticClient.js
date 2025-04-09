import { Client } from '@elastic/elasticsearch';

//Elastic Initialization
const config= {
    node: `${process.env.ELASTIC_ENDPOINT}`,
    auth: {
        apiKey: `${process.env.ELASTIC_API_KEY}`,
    },
};

export const elasticClient = new Client(config);


//Simple check to see whether or not an index exists
const checkIndex = async (indexName) => {
   await elasticClient.indices.exists({index: indexName}) ? console.log(`Index: ${indexName} exists.`) : console.log(`No indices found with the name ${indexName}.`)
}


