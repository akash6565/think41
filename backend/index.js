const express = require('express');
const connectDB = require('./config/db');
const User = require('./models/User');
const Session = require('./models/Session');

dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

connectDB();

// (Just to verify schemas work)
app.get('/health', (req, res) => res.send('OK'));

// Create a new user
app.post('/api/users', async (req, res) => {
  const { email, name } = req.body;
  const user = await User.create({ email, name });
  res.status(201).json(user);
});

// Create a new session for a user
app.post('/api/users/:userId/sessions', async (req, res) => {
  const session = await Session.create({ user: req.params.userId, messages: [] });
  // link session to user
  await User.findByIdAndUpdate(req.params.userId, { $push: { sessions: session._id } });
  res.status(201).json(session);
});

// Get all sessions (with last message) for a user
app.get('/api/users/:userId/sessions', async (req, res) => {
  const sessions = await Session.find({ user: req.params.userId })
    .select('messages updatedAt')
    .sort({ updatedAt: -1 });
  res.json(sessions);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
