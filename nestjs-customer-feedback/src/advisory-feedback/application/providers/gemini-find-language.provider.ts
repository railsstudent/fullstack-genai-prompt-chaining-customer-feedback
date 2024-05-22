import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { Provider } from '@nestjs/common';
import { env } from '~configs/env.config';
import { GENERATION_CONFIG, SAFETY_SETTINGS } from '../configs/genimi.config';
import { GEMINI_FIND_LANGUAGE_MODEL } from '../constants/gemini.constant';

const FIND_LANGUAGE_SYSTEM_INSTRUCTION = `You are a multilingual assistant who can identify the language used in this piece of text. Give me the language name, and nothing else.
  If the text is written in Chinese, please differentiate Traditional Chinese and Simplified Chinese. 
  `;

export const GeminiFindLanguageProvider: Provider<GenerativeModel> = {
  provide: GEMINI_FIND_LANGUAGE_MODEL,
  useFactory: () => {
    const genAI = new GoogleGenerativeAI(env.GEMINI.API_KEY);
    return genAI.getGenerativeModel({
      model: env.GEMINI.MODEL_NAME,
      systemInstruction: FIND_LANGUAGE_SYSTEM_INSTRUCTION,
      generationConfig: GENERATION_CONFIG,
      safetySettings: SAFETY_SETTINGS,
    });
  },
};
