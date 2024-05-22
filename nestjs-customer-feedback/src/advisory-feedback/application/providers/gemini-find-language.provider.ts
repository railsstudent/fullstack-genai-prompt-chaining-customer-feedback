import { GenerativeModel } from '@google/generative-ai';
import { Provider } from '@nestjs/common';
import { GEMINI_FIND_LANGUAGE_MODEL } from '../constants/gemini.constant';
import { modelFactory } from './model-factory';

const FIND_LANGUAGE_SYSTEM_INSTRUCTION = `You are a multilingual expert that can identify the language used in this piece of text. Give me the language name, and nothing else.
  If the text is written in Chinese, please differentiate Traditional Chinese and Simplified Chinese. 
  `;

export const GeminiFindLanguageProvider: Provider<GenerativeModel> = {
  provide: GEMINI_FIND_LANGUAGE_MODEL,
  useFactory: () => modelFactory(FIND_LANGUAGE_SYSTEM_INSTRUCTION),
};
