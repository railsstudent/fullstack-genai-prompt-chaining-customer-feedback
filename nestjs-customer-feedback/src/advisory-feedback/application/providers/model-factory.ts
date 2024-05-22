import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '~configs/env.config';
import { GENERATION_CONFIG, SAFETY_SETTINGS } from '../configs/genimi.config';

export function modelFactory(systemInstruction: string, toJson = false) {
  const genAI = new GoogleGenerativeAI(env.GEMINI.API_KEY);
  const generationConfig = toJson ? { ...GENERATION_CONFIG, responseMimeType: 'application/json' } : GENERATION_CONFIG;
  return genAI.getGenerativeModel({
    model: env.GEMINI.MODEL_NAME,
    systemInstruction,
    generationConfig,
    safetySettings: SAFETY_SETTINGS,
  });
}
