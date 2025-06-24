import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';
import { basketballAgent } from './agents';



console.log('Starting Mastra server...');

export const mastra = new Mastra({
  agents: { basketballAgent },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
  server:{
    timeout: 10 * 60 * 1000, // 10 minutes
    cors: {
      origin: "*",
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: [
        "Content-Type",
        "Authorization",
        "x-mastra-client-type",
        "x-highlight-request",
        "traceparent",
      ],
      exposeHeaders: ["Content-Length", "X-Requested-With"],
      credentials: false,
    },
  },

});

console.log('Mastra server configured.'); // Log after server configuration