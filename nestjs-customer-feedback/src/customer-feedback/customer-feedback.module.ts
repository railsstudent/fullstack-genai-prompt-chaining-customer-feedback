import { Module } from '@nestjs/common';
import { CustomeFeedbackPromptChainingService } from './application/custome-feedback-prompt-chaining.service';
import { CustomerFeedbackService } from './application/customer-feedback.service';
import { CustomerFeedbackController } from './presenters/http/customer-feedback.controller';

@Module({
  controllers: [CustomerFeedbackController],
  providers: [CustomeFeedbackPromptChainingService, CustomerFeedbackService],
})
export class CustomerFeedbackModule {}
