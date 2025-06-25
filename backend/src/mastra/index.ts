import { Mastra } from '@mastra/core/mastra';
import { basketballAgent } from './agents';



console.log('Starting Mastra server...');

export const mastra = new Mastra({
  agents: { basketballAgent },
  server:{
    timeout: 10 * 60 * 1000, // 10 minutes
    cors: {
      origin: ['http://localhost:5173'],
      allowMethods: ["GET", "POST"],
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