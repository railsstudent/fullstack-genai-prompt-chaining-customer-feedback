import { GenerativeModel } from '@google/generative-ai';
import { Provider } from '@nestjs/common';
import { GEMINI_REPLY_MODEL } from '../constants/gemini.constant';
import { modelFactory } from './model-factory';

const REPLY_SYSTEM_INSTRUCTION =
  "You are a professional ESG advisor, please give a short reply to customer's response and in the same language.";

export const GeminiReplyProvider: Provider<GenerativeModel> = {
  provide: GEMINI_REPLY_MODEL,
  useFactory: () => modelFactory(REPLY_SYSTEM_INSTRUCTION),
};
