import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '~configs/env.config';
import { GENERATION_CONFIG, SAFETY_SETTINGS } from '../configs/genimi.config';
import { SentimentAnalysis } from '../types/sentiment-analysis.type';

export function createAdvisoryFeedbackModel({ sentiment, topic }: SentimentAnalysis): GenerativeModel {
  const genAI = new GoogleGenerativeAI(env.GEMINI.API_KEY);

  const advisoryFeedbackSystemInstruction = `
    The customer wrote a ${sentiment} feedback about ${topic}. 
    You are a professional ESG advisor, please give a short reply to customer's response.
    Response: 
  `;

  return genAI.getGenerativeModel({
    model: env.GEMINI.MODEL_NAME,
    systemInstruction: advisoryFeedbackSystemInstruction,
    generationConfig: GENERATION_CONFIG,
    safetySettings: SAFETY_SETTINGS,
  });
}
