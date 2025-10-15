import express from 'express';
import { join } from 'path';
import fs from 'fs';
import { nanoid } from 'nanoid';
import db from '../db.js';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Load environment variables
dotenv.config();

// 2. Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 
const router = express.Router();

const promptPath = join(process.cwd(), 'backend', 'prompts', 'symptom_prompt.txt');
let promptTemplate = '';
if (fs.existsSync(promptPath)) {
  promptTemplate = fs.readFileSync(promptPath, 'utf8');
}

// Educational disclaimer for safety
const disclaimer = "⚠️ Disclaimer: This is for educational purposes only and not a substitute for professional medical advice.";

// POST /api/symptoms
router.post('/', async (req, res) => {
  try {
    const { symptoms, save = true } = req.body;

    if (!symptoms || typeof symptoms !== 'string' || symptoms.trim().length < 3) {
      return res.status(400).json({ error: 'Please enter a valid symptom description.' });
    }

    // Build prompt
    

    const prompt = promptTemplate
  ? promptTemplate.replace('{{SYMPTOMS}}', symptoms.trim())
  : `
You are a concise and factual medical knowledge assistant.
Based on these symptoms: ${symptoms.trim()}, provide a structured, plain-text medical summary.

The response must:
- Contain no markdown, no symbols like **, #, *, or —.
- Use only plain text with clear section titles and simple spacing.
- Have two main sections exactly named:
  1. Possible Conditions and Reasoning
  2. Next Steps
- Write each condition name on a new line.
- Write a short paragraph below each condition describing it and the reasoning.
- In "Next Steps", organize into these subsections:
    Immediate Self-Care:
    Monitor Your Symptoms:
    When to Seek Medical Attention:

Keep the tone factual, easy to read, educational only.
End with this disclaimer:

Disclaimer: ⚠️ This is for educational purposes only and not a substitute for professional medical advice.
`;


    // 4. Call Gemini LLM using the initialized 'model'
    
    const result = await model.generateContent(prompt);
    const output = result.response.text();

    
    let parsedResult;
    try {
      parsedResult = JSON.parse(output);
    } catch {
      parsedResult = { disclaimer, response: output };
    }

    // Save history to lowdb
    const record = {
      id: nanoid(),
      symptoms,
      result: parsedResult,
      timestamp: new Date().toISOString()
    };

    if (save) {
      db.data.history.push(record);
      db.write();
    }

    res.json(record);
  } catch (error) {
    console.error('Error processing symptoms:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// GET /api/symptoms/history
router.get('/history', (req, res) => {
  res.json(db.data.history.slice(-50)); // last 50 entries
});

export default router;