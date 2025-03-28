// Load .env variables (OPENAI_API_KEY, etc.)
import 'dotenv/config';           
import express from 'express';
import cors from 'cors';
import { mastra } from './mastra/index.js';

const app = express();
app.use(cors());                
app.use(express.json());        

// Quick check to see if Mastra backend is running properly.
app.get('/', (req, res) => {
  res.send('Mastra backend is running');
});



// Chat completion endpoint
app.post('/api/chat', async (req, res) => {
    const { messages } = req.body; 
  
    try {
      // Get our agent by name from Mastra
      const agent = mastra.getAgent('myAgent');  
      // Use the Mastra agent to generate a response
      const result = await agent.generate({ messages });
      // Send back the agent's reply text
      res.json({ content: result.text });
    } catch (err) {
      console.error('Error from agent:', err);
      res.status(500).json({ error: err.message || 'Server error' });
    }
  });
  
  // Start the server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Mastra AI backend listening on port ${PORT}`);
  });
  