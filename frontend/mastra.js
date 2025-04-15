// frontend/src/mastraClient.js
import { MastraClient } from '@mastra/client-js';

// The baseUrl should point to our backend server (from .env file)
const baseUrl = 'http://localhost:5173';

export const mastraClient = new MastraClient({ baseUrl });
