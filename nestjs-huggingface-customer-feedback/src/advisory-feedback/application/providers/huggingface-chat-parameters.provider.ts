import { Provider } from '@nestjs/common';
import { HUGGINGFACE_CHAT_PARAMETERS } from '../constants/huggingface.constant';

export type ChatComputInputParameters = {
  temperature: number;
  top_k: number;
  top_p: number;
  max_tokens: number;
};

export const HuggingFaceChatParametersProvider: Provider<ChatComputInputParameters> = {
  provide: HUGGINGFACE_CHAT_PARAMETERS,
  useValue: {
    temperature: 0,
    top_k: 10,
    top_p: 0.5,
    max_tokens: 2048,
  },
};
