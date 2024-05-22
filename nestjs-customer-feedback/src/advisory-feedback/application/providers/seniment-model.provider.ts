import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { Provider } from '@nestjs/common';
import { env } from '~configs/env.config';
import { GENERATION_CONFIG, SAFETY_SETTINGS } from '../configs/genimi.config';
import { GEMINI_SENTIMENT_ANALYSIS_MODEL } from '../constants/gemini.constant';

const SENTIMENT_ANALYSIS_SYSTEM_INSTRUCTION = `
    You are a sentiment analysis assistant who can identify the sentiment and topic of feedback and return the JSON output { "sentiment": string, "topic": string }.
    When the sentiment is positive, return 'POSITIVE', is neutral, return 'NEUTRAL', is negative, return 'NEGATIVE'.
`;

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
