import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { throttlerConfig } from '~configs/throttler.config';
import { AdvisoryFeedbackModule } from './advisory-feedback/advisory-feedback.module';
import { AppController } from './app.controller';

@Module({
  imports: [throttlerConfig, AdvisoryFeedbackModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
