import { Injectable } from '@nestjs/common';
import { AdvisoryFeedbackPromptChainingService } from './advisory-feedback-prompt-chaining.service';

@Injectable()
export class AdvisoryFeedbackService {
  constructor(private promptChainingService: AdvisoryFeedbackPromptChainingService) {}

  async generateFeedback(prompt: string): Promise<string> {
    const sentiment = await this.promptChainingService.generateSentinment(prompt);
    return this.promptChainingService.generateFeedback(prompt, sentiment);
  }
}
