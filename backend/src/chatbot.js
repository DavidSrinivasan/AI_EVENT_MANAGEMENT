const express = require('express');
const router = express.Router();

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `You are EventIQ's friendly AI assistant. You help event organizers and attendees with event planning, ticketing, venue questions, schedules, and general event management advice. Be helpful, friendly, and keep answers short and clear.`;

router.post('/chat', async (req, res) => {
    const { message, messages } = req.body;

    // If no Groq key yet, return a friendly default reply
    if (!process.env.GROQ_API_KEY) {
        return res.json({
            reply: "Hi! I'm the EventIQ AI assistant. I'm being set up right now — please check back soon!"
        });
    }

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama3-8b-8192',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...(messages || []),
                    { role: 'user', content: message || 'Hello' }
                ],
                max_tokens: 200,
                temperature: 0.7
            })
        });

        const data = await response.json();

        if (data.choices && data.choices[0]) {
            res.json({ reply: data.choices[0].message.content });
        } else {
            res.json({ reply: "I'm having trouble right now. Please try again in a moment!" });
        }

    } catch (error) {
        console.error('Groq error:', error);
        res.json({ reply: "Sorry, I'm temporarily unavailable. Please try again!" });
    }
});

module.exports = router;
