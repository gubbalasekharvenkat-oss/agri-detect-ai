import { GoogleGenAI, Type } from "@google/genai";

export class AgriDetectService {
  /**
   * Analyzes an agricultural plant image using Gemini.
   * Strictly follows @google/genai initialization and content extraction guidelines.
   */
  async detectDisease(imageBase64: string): Promise<any> {
    // Fix: Initialize GoogleGenAI instance inside the method using named parameters and process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { text: "Analyze this agricultural plant image. Identify any diseases or deficiencies. Provide details in JSON format. Include a high-quality Spanish translation (Regional Language) for the disease name, description, and treatment steps." },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageBase64.split(',')[1] || imageBase64
            }
          }
        ]
      },
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
      // Fix: Access response.text property directly as per latest SDK guidelines
      const text = response.text;
      return JSON.parse(text || '{}');
    } catch (e) {
      console.error("Failed to parse Gemini response", e);
      return null;
    }
  }
}