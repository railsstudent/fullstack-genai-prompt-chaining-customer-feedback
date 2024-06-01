import { Provider } from '@nestjs/common';
import { GROQ_CHAT_COMPLETIONS } from '../constants/groq.constant';
import Groq from 'groq-sdk';
import { env } from '~configs/env.config';

export const GroqChatCompletionsProvider: Provider<Groq> = {
  provide: GROQ_CHAT_COMPLETIONS,
  useFactory: () => new Groq({ apiKey: env.GROQ.API_KEY }),
};
