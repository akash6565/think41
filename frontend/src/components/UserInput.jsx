import React, { useState } from 'react';

export default function UserInput({ onSend, disabled }) {
  const [value, setValue] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (!value.trim()) return;
    onSend(value.trim());
    setValue('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center space-x-2"
    >
      <input
        type="text"
        className="flex-1 p-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring"
        placeholder="Type your message…"
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={disabled}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-2xl disabled:opacity-50"
        disabled={disabled}
      >
        Send
      </button>
    </form>
  );
}
