const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const User = require('../models/User');

// POST /api/chat
// Body: { userId: string, conversationId?: string, message: string }
router.post('/', async (req, res) => {
  try {
    const { userId, conversationId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: 'userId and message are required' });
    }

    // 1️⃣ Ensure user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let session;
    if (conversationId) {
      // 2️⃣ Load existing session
      session = await Session.findOne({ _id: conversationId, user: userId });
      if (!session) {
        return res.status(404).json({ error: 'Conversation session not found' });
      }
    } else {
      // 3️⃣ Or create a new session
      session = await Session.create({ user: userId, messages: [] });
      user.sessions.push(session._id);
      await user.save();
    }

    // 4️⃣ Append the user’s message
    session.messages.push({
      sender: 'user',
      text: message,
      timestamp: new Date(),
    });
    await session.save();

    // 5️⃣ Generate AI response (stub for now)
    const aiReplyText = '…thinking (stub response)…';

    // 6️⃣ Append the AI’s message
    session.messages.push({
      sender: 'ai',
      text: aiReplyText,
      timestamp: new Date(),
    });
    await session.save();

    // 7️⃣ Return the updated session
    return res.json({
      conversationId: session._id,
      messages: session.messages,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
