import React from 'react';
import MessageList from './MessageList';
import UserInput from './UserInput';

export default function ChatWindow({ messages, onSend, loading }) {
  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-2xl shadow-lg p-4">
      <header className="text-xl font-semibold mb-4">
        AKASH PATI (RA21)
      </header>

      <div className="flex-1 overflow-y-auto mb-4">
        <MessageList messages={messages} loading={loading} />
      </div>

      <footer>
        <UserInput onSend={onSend} disabled={loading} />
      </footer>
    </div>
  );
}
