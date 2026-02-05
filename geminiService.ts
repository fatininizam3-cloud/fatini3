
import { GoogleGenAI } from "@google/genai";
import { Message } from '../types';

// Focused on conversational analysis without technical jargon, strictly no asterisks
const CHAT_INSTRUCTION = `Anda adalah "InsightAgent", pakar analisis data peribadi yang mesra dan bijak. 
Tugas anda adalah membantu pengguna memahami data risiko bencana melalui perbualan yang natural dalam Bahasa Melayu.

SYARAT PENTING:
- JANGAN GUNAKAN simbol asterisk (*) dalam jawapan anda (cth: jangan gunakan **bold** atau *italic* menggunakan asterisk). 
- JANGAN letak sebarang simbol asterisk dalam teks explanation.
- Jika mahu menekankan sesuatu, gunakan huruf besar (CAPITAL LETTERS) atau struktur ayat yang jelas.

PRINSIP JAWAPAN:
1. JANGAN tunjukkan kod, JSON, atau format teknikal (kecuali format carta yang ditetapkan).
2. Berikan fakta yang tepat berdasarkan data yang diberikan.
3. Gunakan Bahasa Melayu yang profesional tetapi santai.
4. Gunakan perenggan yang pendek atau senarai (bullet points menggunakan simbol - atau nombor) untuk memudahkan pembacaan.
5. Jika jawapan melibatkan banyak angka atau perbandingan, anda DISARANKAN untuk menyertakan carta di bawah teks anda.

FORMAT CARTA (Gunakan ini secara automatik jika relevan):
Sertakan blok JSON berikut di hujung jawapan anda jika data perlu divisualisasikan:
\`\`\`json_chart 
{ 
  "type": "bar" | "line" | "pie", 
  "data": [{"label": "Nama Kawasan/Zon", "value": 10}], 
  "title": "Tajuk Carta Yang Jelas" 
} 
\`\`\`

Pastikan carta untuk "Rancangan Tempatan" (RT) menyenaraikan SEMUA yang terlibat tanpa had jika pengguna bertanya tentang taburan penuh.`;

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }

  async analyzeData(prompt: string, contextData: string, history: Message[]): Promise<string> {
    const fullPrompt = `Konteks Data Semasa:\n---\n${contextData}\n---\n\nSoalan Pengguna: ${prompt}\n\nIngatan: Jangan gunakan sebarang simbol asterisk (*) dalam jawapan anda.`;
    
    const contents = history.map(m => ({ 
      role: m.role === 'user' ? 'user' : 'model' as const, 
      parts: [{ text: m.content }] 
    }));

    contents.push({ role: 'user' as const, parts: [{ text: fullPrompt }] });

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: contents,
        config: { 
          systemInstruction: CHAT_INSTRUCTION, 
          temperature: 0.6 
        },
      });
      
      return response.text || "Maaf, saya tidak dapat menjana jawapan sekarang.";
    } catch (err) {
      console.error("Gemini API Error:", err);
      throw err;
    }
  }
}

export const geminiService = new GeminiService();
