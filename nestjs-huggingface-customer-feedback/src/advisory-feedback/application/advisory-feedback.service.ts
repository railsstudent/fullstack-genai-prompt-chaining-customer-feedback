import { Injectable } from '@nestjs/common';
import { AdvisoryFeedbackPromptChainingService } from './advisory-feedback-prompt-chaining.service';

@Injectable()
export class AdvisoryFeedbackService {
  constructor(private promptChainingService: AdvisoryFeedbackPromptChainingService) {}

  generateFeedback(prompt: string): Promise<string> {
    return this.promptChainingService.generateFeedback(prompt);
  }
}
