import { Provider } from '@nestjs/common';
import { GROQ } from '../constants/groq.constant';
import Groq from 'groq-sdk';
import { env } from '~configs/env.config';

export const GroqProvider: Provider<Groq> = {
  provide: GROQ,
  useFactory: () =>
    new Groq({
      apiKey: env.GROQ.API_KEY,
    }),
};
