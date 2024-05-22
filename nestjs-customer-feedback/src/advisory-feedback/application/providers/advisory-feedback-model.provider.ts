import { GenerativeModel } from '@google/generative-ai';
import { Provider } from '@nestjs/common';
import { GENERATION_CONFIG } from '../configs/genimi.config';
import { GEMINI_ADVISORY_FEEDBACK_MODEL } from '../constants/gemini.constant';
import { modelFactory } from './model-factory';

const ADVISORY_FEEDBACK_SYSTEM_INSTRUCTION =
  "You are a professional ESG advisor, please give a short reply to customer's response and in the same language.";

export const GeminiAdvisoryFeedbackProvider: Provider<GenerativeModel> = {
  provide: GEMINI_ADVISORY_FEEDBACK_MODEL,
  useFactory: () => modelFactory(ADVISORY_FEEDBACK_SYSTEM_INSTRUCTION, GENERATION_CONFIG),
};
