import { ChatCompletionCreateParamsNonStreaming } from 'groq-sdk/resources/chat/completions';
import { env } from '~configs/env.config';

export const MODEL_CONFIG: Omit<ChatCompletionCreateParamsNonStreaming, 'messages'> = {
  model: env.GROQ.MODEL_NAME,
  temperature: 0.5,
  max_tokens: 1024,
  top_p: 0.5,
  stream: false,
};
