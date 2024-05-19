import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '~configs/env.config';
import { GENERATION_CONFIG, SAFETY_SETTINGS } from '../configs/genimi.config';
import { SENTIMENT } from '../enums/sentiment.enum';

const genAI = new GoogleGenerativeAI(env.GEMINI.API_KEY);

export function createFeedbackModel(sentimentAnalysis: { sentiment: string; topic: string }): GenerativeModel {
  const sentimentToEnum = sentimentAnalysis.sentiment as unknown as SENTIMENT;

  const customFeedbackSystemInstruction = `
    The customer wrote a ${SENTIMENT[sentimentToEnum]} feedback about ${sentimentAnalysis.topic}. 
    You are a professional ESG advisor, please give a short reply to customer's response.
    Response: 
`;

  return genAI.getGenerativeModel({
    model: env.GEMINI.MODEL_NAME,
    systemInstruction: customFeedbackSystemInstruction,
    generationConfig: GENERATION_CONFIG,
    safetySettings: SAFETY_SETTINGS,
  });
}
