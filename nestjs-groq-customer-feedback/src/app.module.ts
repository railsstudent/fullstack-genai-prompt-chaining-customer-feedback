import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { throttlerConfig } from './configs/throttler.config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [throttlerConfig],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
