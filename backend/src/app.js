require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 4000;

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ─── Database Connection ──────────────────────────────────────
mongoose.connect(
    process.env.MONGODB_URI || 'mongodb://localhost:27017/ai_event_management',
    { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ─── Routes ───────────────────────────────────────────────────
app.use('/api/chatbot',  require('./src/routes/chatbot'));
app.use('/api/payments', require('./src/routes/payments'));
app.use('/api',          require('./routes'));

// ─── Health Check ─────────────────────────────────────────────
app.get('/', (req, res) => {
    res.json({ status: 'EventIQ API is running', port: PORT });
});

// ─── Start Server ─────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});