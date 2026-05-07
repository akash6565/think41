import React, { useEffect } from 'react';
import { useChat } from '../context/ChatContext';

export default function ConversationList() {
  const { sessions, fetchSessions, selectSession, conversationId } = useChat();

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className="w-1/3 pr-4 border-r border-gray-300 overflow-y-auto">
      <h2 className="font-semibold mb-2">Conversations</h2>
      <ul className="space-y-1">
        {sessions.map((session) => (
          <li
            key={session._id}
            onClick={() => selectSession(session._id)}
            className={`cursor-pointer p-2 rounded-lg text-sm ${
              conversationId === session._id
                ? 'bg-blue-100 font-semibold'
                : 'hover:bg-gray-100'
            }`}
          >
            Session {session._id.slice(-5)} – {new Date(session.updatedAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
