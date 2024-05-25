import { Module } from '@nestjs/common';
import { AdvisoryFeedbackPromptChainingService } from './application/advisory-feedback-prompt-chaining.service';
import { AdvisoryFeedbackService } from './application/advisory-feedback.service';
import { GeminiAdvisoryFeedbackProvider } from './application/providers/advisory-feedback-model.provider';
import { GeminiSentimentAnalysisProvider } from './application/providers/sentiment-model.provider';
import { AdvisoryFeedbackController } from './presenters/http/advisory-feedback.controller';
import { GeminiFindLanguageProvider } from './application/providers/gemini-find-language.provider';

@Module({
  controllers: [AdvisoryFeedbackController],
  providers: [
    AdvisoryFeedbackPromptChainingService,
    AdvisoryFeedbackService,
    GeminiSentimentAnalysisProvider,
    GeminiAdvisoryFeedbackProvider,
    GeminiFindLanguageProvider,
  ],
})
export class AdvisoryFeedbackModule {}
