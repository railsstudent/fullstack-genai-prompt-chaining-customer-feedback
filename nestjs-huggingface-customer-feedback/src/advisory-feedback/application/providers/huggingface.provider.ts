import { HfInference } from '@huggingface/inference';
import { Provider } from '@nestjs/common';
import { env } from '~configs/env.config';
import { HUGGINGFACE_INFERENCE } from '../constants/huggingface.constant';

export const HuggingFaceProvider: Provider<HfInference> = {
  provide: HUGGINGFACE_INFERENCE,
  useFactory: () => new HfInference(env.HUGGINGFACE.API_KEY),
};
