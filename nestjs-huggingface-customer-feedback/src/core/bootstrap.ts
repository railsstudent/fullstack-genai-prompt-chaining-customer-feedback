import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import { AppModule } from '~app.module';
import { env } from '~configs/env.config';
import { validateConfig } from '~configs/validate.config';

export class Bootstrap {
  private app: NestExpressApplication;

  async initApp() {
    this.app = await NestFactory.create(AppModule);
  }

  enableCors() {
    this.app.enableCors();
  }

  setupMiddleware() {
    this.app.use(express.json({ limit: '1000kb' }));
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(compression());
    this.app.use(helmet());
  }

  setupGlobalPipe() {
    this.app.useGlobalPipes(validateConfig);
  }

  async startApp() {
    await this.app.listen(env.PORT);
  }

  setupSwagger() {
    const config = new DocumentBuilder()
      .setTitle('ESG Advisory Feedback with Huggingface')
      .setDescription(
        'Integrate with HuggingFace and Mistral model to improve ESG advisory feebacking by prompt chaining',
      )
      .setVersion('1.0')
      .addTag('Huggingface, Mistral 7B model, Conversation')
      .build();
    const document = SwaggerModule.createDocument(this.app, config);
    SwaggerModule.setup('api', this.app, document);
  }
}
