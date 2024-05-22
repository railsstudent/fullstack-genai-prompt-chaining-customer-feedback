import { GenerativeModel } from '@google/generative-ai';
import { Provider } from '@nestjs/common';
import { GENERATION_CONFIG } from '../configs/genimi.config';
import { GEMINI_SENTIMENT_ANALYSIS_MODEL } from '../constants/gemini.constant';
import { modelFactory } from './model-factory';

const SENTIMENT_ANALYSIS_SYSTEM_INSTRUCTION = `
    You are a sentiment analysis assistant who can identify the sentiment and topic of feedback and return the JSON output { "sentiment": string, "topic": string }.
    When the sentiment is positive, return 'POSITIVE', is neutral, return 'NEUTRAL', is negative, return 'NEGATIVE'.
`;

export const GeminiSentimentAnalysisProvider: Provider<GenerativeModel> = {
  provide: GEMINI_SENTIMENT_ANALYSIS_MODEL,
  useFactory: () =>
    modelFactory(SENTIMENT_ANALYSIS_SYSTEM_INSTRUCTION, {
      ...GENERATION_CONFIG,
      responseMimeType: 'application/json',
    }),
};
