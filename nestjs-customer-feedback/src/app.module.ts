import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AdvisoryFeedbackModule } from '~advisory-feedback/advisory-feedback.module';

@Module({
  imports: [AdvisoryFeedbackModule],
  controllers: [AppController],
})
export class AppModule {}
