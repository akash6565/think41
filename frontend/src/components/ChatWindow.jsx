import React from 'react';
import MessageList from './MessageList';
import UserInput from './UserInput';
import { useChat } from '../context/ChatContext';

export default function ChatWindow() {
  const { messages, sendMessage, loading } = useChat();

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-md p-4">
      <header className="text-xl font-bold mb-4 text-blue-700">AKASH PATI (RA21)</header>
      <div className="flex-1 overflow-y-auto mb-4">
        <MessageList messages={messages} loading={loading} />
      </div>
      <footer>
        <UserInput onSend={sendMessage} disabled={loading} />
      </footer>
    </div>
  );
}
