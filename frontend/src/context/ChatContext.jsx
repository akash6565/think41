import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! How can I assist you today?' },
  ]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [conversationId, setConversationId] = useState(null);
  // Add below other useState hooks:
  const [sessions, setSessions] = useState([]);
  const userId = 'USER_ID_123'; // Replace with dynamic userId logic if available

  const sendMessage = async (text) => {
    const userMessage = { sender: 'user', text };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/chat', {
        userId,
        conversationId,
        message: text,
      });

      setConversationId(res.data.conversationId); // Save if it's the first time
      setMessages(res.data.messages);
    } catch (error) {
      console.error('❌ API error:', error);
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Sorry, something went wrong.' },
      ]);
    } finally {
      setLoading(false);
    }
  };
  // Fetch all session summaries
const fetchSessions = async () => {
  try {
    const res = await axios.get(`http://localhost:5000/api/users/${userId}/sessions`);
    setSessions(res.data);
  } catch (error) {
    console.error('Error fetching sessions:', error);
  }
};

// Select existing session and load its messages
const selectSession = async (sessionId) => {
  try {
    const session = await axios.get(`http://localhost:5000/api/session/${sessionId}`);
    setMessages(session.data.messages);
    setConversationId(sessionId);
  } catch (error) {
    console.error('Error loading session:', error);
  }
};

  return (
    <ChatContext.Provider
      value={{
        messages,
        loading,
        inputValue,
        setInputValue,
        sendMessage,
        sessions,
        fetchSessions,
        selectSession,
        conversationId,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
