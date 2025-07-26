import React from 'react';
import MessageList from './MessageList';
import UserInput from './UserInput';
import ConversationList from './ConversationList';
import { useChat } from '../context/ChatContext';

export default function ChatWindow() {
  const { messages, sendMessage, loading } = useChat();

  return (
    <div className="flex h-full bg-white rounded-2xl shadow-md overflow-hidden">
      <ConversationList />

      <div className="flex flex-col w-2/3 p-4">
        <header className="text-xl font-bold mb-2 text-blue-700">AKASH PATI (RA21)</header>

        <div className="flex-1 overflow-y-auto mb-2">
          <MessageList messages={messages} loading={loading} />
        </div>

        <UserInput onSend={sendMessage} disabled={loading} />
      </div>
    </div>
  );
}
