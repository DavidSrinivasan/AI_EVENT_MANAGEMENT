const express = require('express');
const router = express.Router();

// Using Groq - FREE alternative to OpenAI
// Sign up at console.groq.com - no card needed

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `You are EventIQ's AI assistant. You help event organizers and attendees with:
- Event planning and logistics
- Ticket and registration questions  
- Venue information and directions
- Schedule and agenda queries
- General event management advice
Be helpful, friendly, and concise. Keep answers under 3 sentences.`;

router.post('/chat', async (req, res) => {
    const { message, messages } = req.body;

    if (!process.env.GROQ_API_KEY) {
        return res.json({ 
            reply: "Hi! I'm the EventIQ assistant. The AI service is being configured. Please check back soon!" 
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
            res.json({ reply: "I'm having trouble connecting. Please try again in a moment!" });
        }

    } catch (error) {
        console.error('Groq API error:', error);
        res.json({ reply: "Sorry, I'm temporarily unavailable. Please try again!" });
    }
});

module.exports = router;
