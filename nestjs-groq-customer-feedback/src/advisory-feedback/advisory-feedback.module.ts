import { Module } from '@nestjs/common';
import { AdvisoryFeedbackPromptChainingService } from './application/advisory-feedback-prompt-chaining.service';
import { AdvisoryFeedbackService } from './application/advisory-feedback.service';
import { GroqChatCompletionsProvider } from './application/providers/groq.provider';
import { AdvisoryFeedbackController } from './presenters/http/advisory-feedback.controller';

@Module({
  controllers: [AdvisoryFeedbackController],
  providers: [GroqChatCompletionsProvider, AdvisoryFeedbackPromptChainingService, AdvisoryFeedbackService],
})
export class AdvisoryFeedbackModule {}
