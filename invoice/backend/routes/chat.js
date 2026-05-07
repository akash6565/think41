const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const User    = require('../models/User');
const Product = require('../models/Product');
const Order   = require('../models/Order');

const Groq    = require('groq-sdk');
const groq    = new Groq({ apiKey: process.env.GROQ_API_KEY });

// POST /api/chat
router.post('/', async (req, res) => {
  try {
    const { userId, conversationId, message } = req.body;
    if (!userId || !message) {
      return res.status(400).json({ error: 'userId and message are required' });
    }

    // 1. Load or create session
    let session;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (conversationId) {
      session = await Session.findOne({ _id: conversationId, user: userId });
      if (!session) return res.status(404).json({ error: 'Session not found' });
    } else {
      session = await Session.create({ user: userId, messages: [] });
      user.sessions.push(session._id);
      await user.save();
    }

    // 2. Append user message
    session.messages.push({ sender: 'user', text: message, timestamp: new Date() });
    await session.save();

    // 3. Business‑logic / intent detection
    let aiReplyText;

    // 3a. Top 5 most sold products
    if (/top\s*5.*sold\s*products/i.test(message)) {
      const top5 = await Product.find().sort({ sold: -1 }).limit(5);
      aiReplyText = top5
        .map(p => `${p.name} (Sold: ${p.sold})`)
        .join('\n');
    }
    // 3b. Order status with ID provided
    else if (/status\s*of\s*order\s*id\s*([A-Za-z0-9_-]+)/i.test(message)) {
      const [, id] = message.match(/status\s*of\s*order\s*id\s*([A-Za-z0-9_-]+)/i);
      const order = await Order.findOne({ orderId: id });
      aiReplyText = order
        ? `Order ${id} is currently: **${order.status}**`
        : `I couldn’t find any order with ID ${id}.`;
    }
    // 3c. Order status but no ID
    else if (/status\s*of\s*order/i.test(message)) {
      aiReplyText = 'Sure—could you please provide the Order ID?';
    }
    // 3d. Fallback to LLM (Groq)
    else {
      // construct context for Groq
      const messages = session.messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      })).concat({ role: 'user', content: message });

      const completion = await groq.chat.completions.create({
        model: 'llama3-70b',               // or your chosen model
        messages,
        max_completion_tokens: 512,
      });
      aiReplyText = completion.choices[0].message.content;
    }

    // 4. Append AI reply
    session.messages.push({ sender: 'ai', text: aiReplyText, timestamp: new Date() });
    await session.save();

    // 5. Return updated conversation
    res.json({
      conversationId: session._id,
      messages: session.messages,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
