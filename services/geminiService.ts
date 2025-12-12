import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AIPrediction, ItemCategory } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const enrichItemData = async (itemName: string): Promise<AIPrediction | null> => {
  try {
    const categories = Object.values(ItemCategory).join(', ');
    
    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        category: {
          type: Type.STRING,
          description: `The most fitting category from this list: ${categories}. If unsure, use 'Outros'.`,
        },
        estimatedValue: {
          type: Type.NUMBER,
          description: "Estimated average value in BRL (Brazilian Real) for a single unit of this item.",
        },
        description: {
          type: Type.STRING,
          description: "A short, professional description of the item (max 20 words) in Portuguese.",
        },
      },
      required: ["category", "estimatedValue", "description"],
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate inventory details for an item named: "${itemName}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are an expert inventory assistant. Always respond in Portuguese (PT-BR) for text fields.",
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AIPrediction;
    }
    return null;
  } catch (error) {
    console.error("Error enriching item with Gemini:", error);
    return null;
  }
};
