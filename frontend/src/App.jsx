import React, { useState } from 'react';
import ChatWindow from './components/ChatWindow';

export default function App() {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! How can I help you today?' }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async userText => {
    // append user message
    setMessages(m => [...m, { sender: 'user', text: userText }]);
    setLoading(true);

    // call your /api/chat here…
    // const res = await fetch(...);
    // const data = await res.json();
    // setMessages(data.messages);

    // stub delay
    setTimeout(() => {
      setMessages(m => [...m, { sender: 'ai', text: 'This is a stub response.' }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-xl h-full">
        <ChatWindow
          messages={messages}
          onSend={handleSend}
          loading={loading}
        />
      </div>
    </div>
  );
}
