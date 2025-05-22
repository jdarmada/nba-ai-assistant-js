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
        <div>
            <div className="agent-info">
                <h4 className="stats-title">What's My Agent Doing?</h4>

                <div className="stats-box">
                    <strong className="stats-sub-title">Tools Called:</strong>
                    <ul className="tool-list">
                        {toolsCalled.map((tool, idx) => (
                            <li key={idx}>{tool}</li>
                        ))}
                        {toolsCalled.length === 0 && <li>No tools called yet.</li>}
                    </ul>

                    <div className="usage-stats">
                        <p>Prompt Token Usage: {promptTokenUsage}</p>
                        <p>Completion Token Usage: {completionTokenUsage}</p>
                        <p>Total Token Usage: {totalTokenUsage}</p>
                    </div>
                </div>
            </div>

            <strong>Conversation:</strong>
            <div className="convo-box">
                {messages.map((msg) => (
                    <div key={msg.id} className="message-item">
                        <strong className="message-role">{msg.role === 'assistant' ? 'Basketbot' : 'You'}:</strong>
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Input two players you want to compare."
                    className="input-box"
                />
                <button type="submit" disabled={status === 'streaming'}>
                    {status === 'streaming' ? 'Thinking...' : 'Send'}
                </button>
            </form>
        </div>
    );
}
