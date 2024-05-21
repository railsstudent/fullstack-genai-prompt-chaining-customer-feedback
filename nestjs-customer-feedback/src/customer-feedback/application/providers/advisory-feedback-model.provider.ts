import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '~configs/env.config';
import { GENERATION_CONFIG, SAFETY_SETTINGS } from '../configs/genimi.config';
import { ADVISORY_FEEDBACK_SYSTEM_INSTRUCTION, GEMINI_ADVISORY_FEEDBACK_MODEL } from '../constants/gemini.constant';
import { Provider } from '@nestjs/common';

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
