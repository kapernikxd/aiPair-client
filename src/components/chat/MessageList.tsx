'use client';


import React from 'react';
import type { ChatMessage } from './types';
import MessageBubble from './MessageBubble';


export default function MessageList({ messages }: { messages: ChatMessage[] }) {
    return (
        <div className="space-y-6">
            {messages.map((m) => (
                <MessageBubble key={m.id} m={m} />
            ))}
        </div>
    );
}