import request from 'supertest';
import app from '../server.js'; // Adjust strictly for Node import logic

describe('Election Assistant API Tests', () => {
    test('POST /api/chat - Should return 400 if message is empty', async () => {
        const res = await request(app)
            .post('/api/chat')
            .send({});
            
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Message is required');
    });

    test('POST /api/chat - Should return 500 when Gemini API is misconfigured (no key)', async () => {
        const res = await request(app)
            .post('/api/chat')
            .send({ message: 'How do I vote?' });
            
        // Because default is 'MISSING_KEY' or it fails Auth
        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBeDefined();
    });
});
