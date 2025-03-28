// frontend/src/mastraClient.js
import { MastraClient } from '@mastra/client-js';

// The baseUrl should point to our backend server (from .env file)
const baseUrl = import.meta.env.VITE_MASTRA_API_URL || 'http://localhost:3000';

export const mastraClient = new MastraClient({ baseUrl });
