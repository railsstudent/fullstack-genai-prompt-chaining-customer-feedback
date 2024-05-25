import { Injectable } from '@nestjs/common';
import { AdvisoryFeedbackPromptChainingService } from './advisory-feedback-prompt-chaining.service';
import { ChainOutput } from './types/chant-output.type';

@Injectable()
export class AdvisoryFeedbackService {
  constructor(private promptChainingService: AdvisoryFeedbackPromptChainingService) {}

  generateFeedback(prompt: string): Promise<string> {
    return this.promptChainingService.generateFeedback(prompt);
  }

  testChains(prompt: string): Promise<ChainOutput> {
    return this.promptChainingService.testChains(prompt);
  }
}
