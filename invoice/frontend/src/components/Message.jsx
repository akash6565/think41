import React from 'react';

export default function Message({ sender, text }) {
  const isUser = sender === 'user';
  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`
          max-w-[75%] p-2 rounded-2xl
          ${isUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'}
        `}
      >
        {text}
      </div>
    </div>
  );
}
