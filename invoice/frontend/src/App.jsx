import React from 'react';
import { ChatProvider } from './context/ChatContext';
import ChatWindow from './components/ChatWindow';

export default function App() {
  return (
    <ChatProvider>
      <div className="h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-xl h-full">
          <ChatWindow />
        </div>
      </div>
    </ChatProvider>
  );
}
