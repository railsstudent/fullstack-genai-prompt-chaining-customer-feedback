import { GoogleGenerativeAI, GenerationConfig } from '@google/generative-ai';
import { env } from '~configs/env.config';
import { SAFETY_SETTINGS } from '../configs/genimi.config';

export function modelFactory(systemInstruction: string, generationConfig: GenerationConfig) {
  const genAI = new GoogleGenerativeAI(env.GEMINI.API_KEY);
  return genAI.getGenerativeModel({
    model: env.GEMINI.MODEL_NAME,
    systemInstruction,
    generationConfig,
    safetySettings: SAFETY_SETTINGS,
  });
}
