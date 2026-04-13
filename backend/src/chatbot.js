const express = require('express');
const OpenAI = require('openai');
const router = express.Router();

const SYSTEM_PROMPT = `You are EventIQ's intelligent AI assistant for a global event management platform. You help users with:
- Finding and recommending venues worldwide based on location, capacity, budget, and event type
- Event planning advice including timelines, checklists, and budgets
- Answering questions about venue features, pricing, and availability
- ROI and financial analysis for events
- General event management best practices
Be helpful, specific, and concise. When recommending venues, mention realistic options for the city or country mentioned. Keep answers to 2-4 sentences.`;

router.post('/chat', async (req, res) => {
    const { message, messages } = req.body;

    if (!process.env.OPENAI_API_KEY) {
        return res.json({
            reply: "AI service not configured. Please add OPENAI_API_KEY to your Render environment variables."
        });
    }

    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        const history = (messages || []).slice(-8).map(m => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.content
        }));

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                ...history,
                { role: 'user', content: message || 'Hello' }
            ],
            max_tokens: 200,
            temperature: 0.7
        });

        const reply = completion.choices?.[0]?.message?.content;
        res.json({ reply: reply || "I couldn't generate a response. Please try again!" });

    } catch (err) {
        console.error('OpenAI error:', err?.message || err);
        res.json({ reply: "I'm temporarily unavailable. Please try again in a moment!" });
    }
});

module.exports = router;
