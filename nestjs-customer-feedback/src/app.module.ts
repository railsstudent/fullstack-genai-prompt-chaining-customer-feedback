import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CustomerFeedbackModule } from '~customer-feedback/customer-feedback.module';

@Module({
  imports: [CustomerFeedbackModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
