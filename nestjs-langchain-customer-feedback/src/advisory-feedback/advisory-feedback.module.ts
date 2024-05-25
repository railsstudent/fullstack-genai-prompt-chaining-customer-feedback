import { Module } from '@nestjs/common';
import { AdvisoryFeedbackController } from './presenters/http/advisory-feedback.controller';
import { AdvisoryFeedbackService } from './application/advisory-feedback.service';
import { AdvisoryFeedbackPromptChainingService } from './application/advisory-feedback-prompt-chaining.service';
import { GeminiChatModelProvider } from './application/providers/gemini-chat-model.provider';

@Module({
  controllers: [AdvisoryFeedbackController],
  providers: [GeminiChatModelProvider, AdvisoryFeedbackService, AdvisoryFeedbackPromptChainingService],
})
export class AdvisoryFeedbackModule {}
