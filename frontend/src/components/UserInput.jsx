import React from 'react';
import { useChat } from '../context/ChatContext';

export default function UserInput({ disabled }) {
  const { inputValue, setInputValue, sendMessage } = useChat();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    sendMessage(inputValue.trim());
    setInputValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="flex-1 p-2 border border-gray-300 rounded-xl focus:outline-none"
        placeholder="Type your message..."
        disabled={disabled}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-xl disabled:opacity-50"
        disabled={disabled}
      >
        Send
      </button>
    </form>
  );
}
