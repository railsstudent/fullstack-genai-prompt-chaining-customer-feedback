import { Provider } from '@nestjs/common';
import { GROQ_REPLY_MODEL as GROQ_CHAT_MODEL } from '../constants/groq.constant';
import Groq from 'groq-sdk';
import { env } from '~configs/env.config';

export const GroqChatModelProvider: Provider<Groq> = {
  provide: GROQ_CHAT_MODEL,
  useFactory: () => new Groq({ apiKey: env.GROQ.API_KEY }),
};
