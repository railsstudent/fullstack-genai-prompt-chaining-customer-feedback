import { Module } from '@nestjs/common';
import { GroqProvider } from './application/providers/groq.provider';
import { AdvisoryFeedbackController } from './presenters/https/advisory-feedback.controller';

@Module({
  controllers: [AdvisoryFeedbackController],
  providers: [GroqProvider],
})
export class AdvisoryFeedbackModule {}
