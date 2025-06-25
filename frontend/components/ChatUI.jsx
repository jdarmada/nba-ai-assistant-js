import React, { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import ReactMarkdown from 'react-markdown';

export default function ChatUI() {
    const [totalTokenUsage, setTotalTokenUsage] = useState(0);
    const [promptTokenUsage, setPromptTokenUsage] = useState(0);
    const [completionTokenUsage, setCompletionTokenUsage] = useState(0);
    const [toolsCalled, setToolsCalled] = useState([]);

    const { messages, input, handleInputChange, handleSubmit, status } = useChat({
        api: 'http://localhost:4111/api/agents/basketballAgent/stream', //Replace with your own endpoint for your agent
        id: 'my-chat-session',

        //Optional parameter to check agent tool calls
        onToolCall: ({ toolCall }) => {
            setToolsCalled((prev) => [...prev, toolCall.toolName]);
        },

        //Optional parameter to check token usages
        onFinish: (message, { usage }) => {
            setTotalTokenUsage((prev) => prev + usage.totalTokens);
            setPromptTokenUsage((prev) => prev + usage.promptTokens);
            setCompletionTokenUsage((prev) => prev + usage.completionTokens);
        },

        //Optional parameter for error handling
        onError: (error) => {
            console.error('Agent error:', error);
        },
    });

    return (
        <div className="chat-container">
            <header className="chat-header">
                <h1 className="chat-title">NBA Fantasy Expert</h1>
            </header>

            <section className="agent-stats">
                <h2 className="stats-title">What's My Agent Doing?</h2>

                <div className="stats-content">
                    <div className="stats-section">
                        <h3 className="stats-subtitle">Tools Called:</h3>
                        <ul className="tool-list">
                            {toolsCalled.map((tool, idx) => (
                                <li key={idx}>{tool}</li>
                            ))}
                            {toolsCalled.length === 0 && <li>No tools called yet.</li>}
                        </ul>
                    </div>

                    <div className="stats-section">
                        <div className="usage-stats">
                            <p><span className="stat-label">Prompt Token Usage:</span> <span className="stat-value">{promptTokenUsage}</span></p>
                            <p><span className="stat-label">Completion Token Usage:</span> <span className="stat-value">{completionTokenUsage}</span></p>
                            <p><span className="stat-label">Total Token Usage:</span> <span className="stat-value">{totalTokenUsage}</span></p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="conversation-container">
                <h2 className="conversation-title">Conversation:</h2>
                <div className="conversation-messages">
                    {messages.map((msg) => (
                        <div key={msg.id} className="message">
                            <span className="message-role">
                                {msg.role === 'assistant' ? 'Basketbot' : 'You'}:
                            </span>
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                    ))}
                </div>
            </section>

            <form onSubmit={handleSubmit} className="chat-form">
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Input two players you want to compare."
                    className="chat-input"
                />
                <button type="submit" disabled={status === 'streaming'}>
                    {status === 'streaming' ? 'Thinking...' : 'Send'}
                </button>
            </form>
        </div>
    );
}