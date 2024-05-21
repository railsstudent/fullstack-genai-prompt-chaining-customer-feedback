import { Module } from '@nestjs/common';
import { AdvisoryFeedbackPromptChainingService } from './application/advisory-feedback-prompt-chaining.service';
import { AdvisoryFeedbackService } from './application/advisory-feedback.service';
import { AdvisoryFeedbackController } from './presenters/http/advisory-feedback.controller';

@Module({
  controllers: [AdvisoryFeedbackController],
  providers: [AdvisoryFeedbackPromptChainingService, AdvisoryFeedbackService],
})
export class AdvisoryFeedbackModule {}
