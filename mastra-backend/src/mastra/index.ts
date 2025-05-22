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
  serverMiddleware: [{
    handler: async (c, next) => {
      // Add CORS headers
      c.header('Access-Control-Allow-Origin', '*');
      c.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      // Handle preflight requests
      if (c.req.method === 'OPTIONS') {
        return new Response(null, { status: 204 });
      }
      
      await next();
    }
  }]
});

console.log('Mastra server configured.'); // Log after server configuration

