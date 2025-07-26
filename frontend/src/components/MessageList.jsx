import React, { useEffect, useRef } from 'react';
import Message from './Message';

export default function MessageList({ messages, loading }) {
  const bottomRef = useRef(null);

  // scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="space-y-2">
      {messages.map((msg, idx) => (
        <Message key={idx} sender={msg.sender} text={msg.text} />
      ))}
      {loading && (
        <div className="text-sm italic text-gray-500">AI is typing...</div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
