require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const sceneRoutes = require('./routes/scene');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/3dsceneapp')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-super-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/3dsceneapp',
    touchAfter: 24 * 3600, // lazy update
  }),
  cookie: {
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  maxAge: 1000 * 60 * 60 * 24 * 7,
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
},
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/scene', sceneRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', user: req.session.userId || null }));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
