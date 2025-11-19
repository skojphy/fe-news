import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeminiArticleResponse, GeminiEventsResponse, GeminiFunResponse } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = "gemini-2.5-flash";

// Helper to clean JSON string if the model adds markdown blocks
const cleanJson = (text: string) => {
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
};

export const generateArticle = async (topic: string): Promise<GeminiArticleResponse> => {
  const prompt = `Write a technical frontend engineering article about: "${topic}" in Korean language.
  It should be engaging, informative, and formatted in Markdown.
  Provide a catchy title in Korean, the markdown content in Korean, and 3-5 relevant tags in English or Korean.`;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      content_markdown: { type: Type.STRING },
      tags: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["title", "content_markdown", "tags"]
  };

  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      systemInstruction: "You are a senior frontend engineer writing for a Korean tech blog named 'Gmarket FE-News'.",
    }
  });

  return JSON.parse(cleanJson(response.text || "{}"));
};

export const generateDevEvents = async (): Promise<GeminiEventsResponse> => {
  const prompt = "List 3 fictitious but realistic upcoming global Frontend Developer conferences or hackathons for the next 6 months. Translate descriptions to Korean where appropriate, but keep Event Names in English if they are international.";

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      events: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            date: { type: Type.STRING },
            location: { type: Type.STRING },
            url: { type: Type.STRING }
          }
        }
      }
    }
  };

  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema
    }
  });

  return JSON.parse(cleanJson(response.text || "{}"));
};

export const generateFunContents = async (): Promise<GeminiFunResponse> => {
  const prompt = "List 3 fun, interesting, or useless web projects/libraries/websites for frontend developers to check out when bored. Provide descriptions in Korean.";

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      contents: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            url: { type: Type.STRING },
            description: { type: Type.STRING }
          }
        }
      }
    }
  };

  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema
    }
  });

  return JSON.parse(cleanJson(response.text || "{}"));
};