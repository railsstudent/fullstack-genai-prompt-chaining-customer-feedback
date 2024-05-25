import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { Provider } from '@nestjs/common';
import { env } from '~configs/env.config';
import { GEMINI_CHAT_MODEL } from '../constants/gemini.constant';

export const GeminiChatModelProvider: Provider<ChatGoogleGenerativeAI> = {
  provide: GEMINI_CHAT_MODEL,
  useFactory: () =>
    new ChatGoogleGenerativeAI({
      apiKey: env.GEMINI.API_KEY,
      model: env.GEMINI.MODEL_NAME,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
      temperature: 0,
      topK: 10,
      topP: 0.5,
      maxOutputTokens: 2048,
    }),
};
