import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AdvisoryFeedbackModule } from '~customer-feedback/advisory-feedback.module';

@Module({
  imports: [AdvisoryFeedbackModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
