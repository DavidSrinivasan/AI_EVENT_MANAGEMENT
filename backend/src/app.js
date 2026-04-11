require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 4000;

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({
    origin: process.env.FRONTEND_URL || '*'
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ─── Database Connection ──────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB error:', err));

// ─── Routes ───────────────────────────────────────────────────
app.use('/api/chatbot', require('./chatbot'));

// ─── Health Check ─────────────────────────────────────────────
app.get('/', (req, res) => {
    res.json({ status: '✅ EventIQ API is running', port: PORT });
});

// ─── Start Server ─────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
