import { Module } from '@nestjs/common';
import { AdvisoryFeedbackPromptChainingService } from './application/advisory-feedback-prompt-chaining.service';
import { AdvisoryFeedbackService } from './application/advisory-feedback.service';
import { HuggingFaceProvider } from './application/providers/huggingface.provider';
import { AdvisoryFeedbackController } from './presenters/http/advisory-feedback.controller';

@Module({
  controllers: [AdvisoryFeedbackController],
  providers: [AdvisoryFeedbackPromptChainingService, AdvisoryFeedbackService, HuggingFaceProvider],
})
export class AdvisoryFeedbackModule {}
