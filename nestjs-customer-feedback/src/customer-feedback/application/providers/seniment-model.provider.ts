import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { Provider } from '@nestjs/common';
import { env } from '~configs/env.config';
import { GENERATION_CONFIG, SAFETY_SETTINGS } from '../configs/genimi.config';
import { GEMINI_SENTIMENT_ANALYSIS_MODEL, SENTIMENT_ANALYSIS_SYSTEM_INSTRUCTION } from '../constants/gemini.constant';

export const GeminiSentimentAnalysisProvider: Provider<GenerativeModel> = {
  provide: GEMINI_SENTIMENT_ANALYSIS_MODEL,
  useFactory: () => {
    const genAI = new GoogleGenerativeAI(env.GEMINI.API_KEY);
    return genAI.getGenerativeModel({
      model: env.GEMINI.MODEL_NAME,
      systemInstruction: SENTIMENT_ANALYSIS_SYSTEM_INSTRUCTION,
      generationConfig: {
        ...GENERATION_CONFIG,
        responseMimeType: 'application/json',
      },
      safetySettings: SAFETY_SETTINGS,
    });
  },
};
