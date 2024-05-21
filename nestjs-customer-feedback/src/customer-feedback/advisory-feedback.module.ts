import { Module } from '@nestjs/common';
import { AdvisoryFeedbackPromptChainingService } from './application/advisory-feedback-prompt-chaining.service';
import { AdvisoryFeedbackService } from './application/advisory-feedback.service';
import { GeminiAdvisoryFeedbackProvider } from './application/providers/advisory-feedback-model.provider';
import { GeminiSentimentAnalysisProvider } from './application/providers/seniment-model.provider';
import { AdvisoryFeedbackController } from './presenters/https/advisory-feedback.controller';

@Module({
  controllers: [AdvisoryFeedbackController],
  providers: [
    AdvisoryFeedbackPromptChainingService,
    AdvisoryFeedbackService,
    GeminiSentimentAnalysisProvider,
    GeminiAdvisoryFeedbackProvider,
  ],
})
export class AdvisoryFeedbackModule {}
