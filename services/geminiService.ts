
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

export class AgriDetectService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: API_KEY || '' });
  }

  async detectDisease(imageBase64: string): Promise<any> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            { text: "Analyze this agricultural plant image. Identify any diseases or deficiencies. Provide details in JSON format. Include a high-quality Spanish translation (Regional Language) for the disease name, description, and treatment steps." },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: imageBase64.split(',')[1] || imageBase64
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diseaseName: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            description: { type: Type.STRING },
            treatment: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            severity: { type: Type.STRING, description: "low, medium, high" },
            // Regional Language (Spanish)
            regionalName: { type: Type.STRING },
            regionalDescription: { type: Type.STRING },
            regionalTreatment: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["diseaseName", "confidence", "description", "treatment", "severity", "regionalName", "regionalDescription", "regionalTreatment"]
        }
      }
    });

    try {
      const text = response.text;
      return JSON.parse(text || '{}');
    } catch (e) {
      console.error("Failed to parse Gemini response", e);
      return null;
    }
  }
}
