const express = require('express');
const axios = require('axios');
const router = express.Router();

const SYSTEM_PROMPT = `You are EventIQ's helpful AI assistant for event planning. Help users find venues, plan events, estimate budgets, and analyze ROI. Be concise and helpful. Keep answers to 2-3 sentences.`;

router.post('/chat', async (req, res) => {
    const { message, messages } = req.body;

    console.log('Chat request received:', message);
    console.log('GROQ_API_KEY exists:', !!process.env.GROQ_API_KEY);
    console.log('Key starts with:', process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.substring(0, 8) : 'MISSING');

    if (!process.env.GROQ_API_KEY) {
        console.log('ERROR: No GROQ_API_KEY found');
        return res.json({
            reply: "GROQ_API_KEY is missing. Please add it to Render environment variables."
        });
    }

    try {
        const history = (messages || []).slice(-6).map(m => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: String(m.content)
        }));

        console.log('Calling Groq API...');

        const response = await axios({
            method: 'POST',
            url: 'https://api.groq.com/openai/v1/chat/completions',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            data: {
                model: 'llama-3.1-8b-instant',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...history,
                    { role: 'user', content: message || 'Hello' }
                ],
                max_tokens: 200,
                temperature: 0.7
            },
            timeout: 25000
        });

        console.log('Groq response status:', response.status);
        const reply = response.data?.choices?.[0]?.message?.content;
        console.log('Reply generated:', reply ? reply.substring(0, 50) : 'EMPTY');

        res.json({ reply: reply || "I couldn't generate a response. Please try again!" });

    } catch (err) {
        const status = err?.response?.status;
        const errData = err?.response?.data;
        const errMsg = err?.message;

        console.error('Groq API Error:');
        console.error('Status:', status);
        console.error('Data:', JSON.stringify(errData));
        console.error('Message:', errMsg);

        let userMsg = "I'm temporarily unavailable. Please try again!";

        if (status === 401) {
            userMsg = "Invalid API key. Please check your GROQ_API_KEY in Render environment variables.";
        } else if (status === 429) {
            userMsg = "Rate limit reached. Please wait a moment and try again.";
        } else if (status === 400) {
            userMsg = "Bad request to AI service. Please try again.";
        } else if (errMsg && errMsg.includes('timeout')) {
            userMsg = "Request timed out. Please try again.";
        } else if (errMsg && errMsg.includes('ECONNREFUSED')) {
            userMsg = "Cannot connect to AI service. Please check network settings.";
        }

        res.json({ reply: userMsg });
    }
});

module.exports = router;
