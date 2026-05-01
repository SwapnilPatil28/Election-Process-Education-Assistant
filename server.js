import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Security and Parsers
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Google Gemini API
// Make sure to set GEMINI_API_KEY in your .env file
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'MISSING_KEY' });

// System prompt for the Election Assistant
const SYSTEM_PROMPT = `You are an Election Process Education Assistant.
Your goal is to help users understand the election process, voting timelines, and steps in an interactive, non-partisan, and easy-to-follow way.
Provide clear, concise, and structured answers. Use simple language. Address questions about registration, polling stations, mail-in ballots, and general democratic processes. Do not express political opinions or endorse candidates.`;

// API Endpoint for Chat
app.post('/api/chat', async (req, res) => {
    try {
        const { message, history, language } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Format history for Gemini
        const formattedHistory = (history || []).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));

        let activePrompt = SYSTEM_PROMPT;
        if (language === 'hi') {
            activePrompt += "\n\nIMPORTANT: The user has switched the platform language to Hindi. You MUST respond completely in Hindi (Devanagari script) from now on.";
        }

        // Execute Gemini API Call to the new preview model
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [
                { role: 'user', parts: [{ text: activePrompt }] },
                { role: 'model', parts: [{ text: language === 'hi' ? 'समझ गया। मैं चुनाव प्रक्रिया में मतदाताओं को हिंदी में शिक्षित करने के लिए तैयार हूं।' : 'Understood. I am ready to help educate voters on the election process.' }] },
                ...formattedHistory,
                { role: 'user', parts: [{ text: message }] }
            ],
        });

        res.json({ answer: response.text });
    } catch (error) {
        console.error('Error with Google Gemini API:', error);
        
        if (error.status === 429) {
            return res.status(429).json({ error: '⚠️ The AI assistant is currently experiencing high traffic (Google API rate limit exceeded). Please wait about a minute and try again.' });
        } else if (error.status === 403) {
             return res.status(403).json({ error: '⚠️ Security Error: The loaded Google API Key is invalid or has been disabled. Please review your environment settings.'});
        }
        
        res.status(500).json({ error: 'Sorry, I encountered an issue processing your request.' });
    }
});

// For testing purposes
export default app;

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Election Assistant Server is running on http://localhost:${PORT}`);
    });
}
