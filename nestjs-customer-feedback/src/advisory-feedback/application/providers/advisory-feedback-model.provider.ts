import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '~configs/env.config';
import { GENERATION_CONFIG, SAFETY_SETTINGS } from '../configs/genimi.config';
import { GEMINI_ADVISORY_FEEDBACK_MODEL } from '../constants/gemini.constant';
import { Provider } from '@nestjs/common';

const ADVISORY_FEEDBACK_SYSTEM_INSTRUCTION =
  "You are a professional ESG advisor, please give a short reply to customer's response and in the same language.";

export const GeminiAdvisoryFeedbackProvider: Provider<GenerativeModel> = {
  provide: GEMINI_ADVISORY_FEEDBACK_MODEL,
  useFactory: () => {
    const genAI = new GoogleGenerativeAI(env.GEMINI.API_KEY);
    return genAI.getGenerativeModel({
      model: env.GEMINI.MODEL_NAME,
      systemInstruction: ADVISORY_FEEDBACK_SYSTEM_INSTRUCTION,
      generationConfig: GENERATION_CONFIG,
      safetySettings: SAFETY_SETTINGS,
    });
  },
};
