import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.VITE_GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

async function test() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: 'Hello'
    });
    console.log(response.text);
  } catch (e) {
    console.error("ERROR:", e);
  }
}
test();
