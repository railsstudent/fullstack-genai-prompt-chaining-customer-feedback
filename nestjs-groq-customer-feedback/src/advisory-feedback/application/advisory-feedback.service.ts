import { Injectable } from '@nestjs/common';
import { AdvisoryFeedbackPromptChainingService } from './advisory-feedback-prompt-chaining.service';

@Injectable()
export class AdvisoryFeedbackService {
  constructor(private promptChainingService: AdvisoryFeedbackPromptChainingService) {}

  generateReply(prompt: string): Promise<string> {
    return this.promptChainingService.generateReply(prompt);
  }
}
