import React, { useEffect, useState } from 'react';
import { MastraClient } from '@mastra/client-js';

const baseUrl = 'http://localhost:4111';

const client = new MastraClient({
  baseUrl,
});

// Get a reference to your local agent
try {
    const agent = client.getAgent("basketballAgent");
    const response = await agent.generate({
      messages: [{ role: "user", content: "Compare LeBron James and Stephen Curry" }]
    });
    console.log("Response:", response);
  } catch (error) {
    console.error("Development error:", error);
  }

export default function ChatUI() {
  const [agent, setAgent] = useState(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        console.log('Fetching agents...');
        const agents = await client.getAgents();
        setAgent(agents);
        console.log('Agents fetched:', agents);
      } catch (error) {
        console.error('Error fetching agents:', error);
      }
    };

    fetchAgents();
  }, []);

  console.log(agent)

  return (
    <div className="chat-container">
    Hello
    </div>
  );
}