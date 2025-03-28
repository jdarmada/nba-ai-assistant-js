import React, { useState } from 'react';
import { mastraClient } from '../mastra'; 

export default function ChatUI() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! Ask me anything about NBA fantasy basketball.' }
  ]);
  const [input, setInput] = useState('');

  // Handle sending a new user message
  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      // Get a reference to our agent via Mastra client
      const agent = mastraClient.getAgent('fantasyAgent');
      // Call the backend to generate a response for the updated conversation
      const response = await agent.generate({ messages: [...messages, userMessage] });
      // Add the assistant's reply to the chat
      setMessages(prev => [...prev, { role: 'assistant', content: response.text }]);
    } catch (err) {
      console.error('Error getting response:', err);
    }
  }

  return (
    <div className="chat-container">
      <ul className="message-list">
        {messages.map((msg, idx) => (
          <li key={idx} className={msg.role === 'assistant' ? 'assistant-msg' : 'user-msg'}>
            <strong>{msg.role === 'assistant' ? 'AI' : 'You'}:</strong> {msg.content}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSend} className="input-form">
        <input 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          placeholder="Type your question..." 
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}