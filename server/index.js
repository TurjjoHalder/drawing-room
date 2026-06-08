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
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.set('trust proxy', 1);
// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    touchAfter: 24 * 3600,
  }),
  cookie: {
    secure: true,           // always true, Render uses HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: 'none',       // always none for cross-domain
  },
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/scene', sceneRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', user: req.session.userId || null }));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
