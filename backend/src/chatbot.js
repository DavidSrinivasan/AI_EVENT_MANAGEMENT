const express = require('express');
const axios = require('axios');
const router = express.Router();

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `You are EventIQ's intelligent AI assistant for a global event management platform. You help users with:
- Finding and recommending venues worldwide based on location, capacity, budget, event type
- Event planning advice (timelines, checklists, budgets)
- Answering questions about venue features, pricing, availability
- ROI and financial analysis for events
- General event management best practices
Be helpful, specific, and concise. When recommending venues mention realistic options for the city/country mentioned.`;

router.post('/chat', async (req, res) => {
    const { message, messages } = req.body;

    if (!process.env.GROQ_API_KEY) {
        return res.json({ reply: "AI service not configured. Please add GROQ_API_KEY to Render environment variables." });
    }

    try {
        const history = (messages || []).slice(-8).map(m => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.content
        }));

        const response = await axios.post(GROQ_API_URL, {
            model: 'llama3-8b-8192',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                ...history,
                { role: 'user', content: message || 'Hello' }
            ],
            max_tokens: 200,
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 20000
        });

        const reply = response.data?.choices?.[0]?.message?.content;
        res.json({ reply: reply || "I couldn't generate a response. Please try again!" });

    } catch (err) {
        console.error('Groq error:', err?.response?.data || err.message);
        res.json({ reply: "I'm temporarily unavailable. Please try again in a moment!" });
    }
});

module.exports = router;
