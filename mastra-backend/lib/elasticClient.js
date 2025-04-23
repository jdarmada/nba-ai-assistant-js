import { Client } from '@elastic/elasticsearch';

//Elastic client Initialization, make sure environment variables are being loaded in correctly
const config= {
    node: `${process.env.ELASTIC_ENDPOINT}`,
    auth: {
        apiKey: `${process.env.ELASTIC_API_KEY}`,
    },
};

export const elasticClient = new Client(config);
