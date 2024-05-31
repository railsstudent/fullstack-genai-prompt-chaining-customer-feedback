import { HfInference } from '@huggingface/inference';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { env } from '~configs/env.config';
import { HUGGINGFACE_INFERENCE } from './constants/huggingface.constant';
import { ChatMessage } from './types/chat-message.type';

@Injectable()
export class AdvisoryFeedbackPromptChainingService {
  private readonly logger = new Logger(AdvisoryFeedbackPromptChainingService.name);

  constructor(@Inject(HUGGINGFACE_INFERENCE) private hfInference: HfInference) {}

  async generateFeedback(feedback: string): Promise<string> {
    try {
      const messages: ChatMessage[] = [
        {
          role: 'user',
          content: `What is the language used to write the feedback? Give me the language name, no explanation, no formal response.
          When the feedback is written in Traditional Chinese, return Traditional Chinese. When the feedback is written in 
          Simplified Chinese, return Simplified Chinese.`,
        },
        {
          role: 'assistant',
          content: 'What is the feedback?',
        },
        {
          role: 'user',
          content: feedback,
        },
      ];

      const response = await this.chat(messages);
      const language = (response.choices[0].message.content || '').replace('.', '').trim();
      this.logger.log(`language -> ${language}`);

      messages.push(
        {
          role: 'assistant',
          content: language,
        },
        {
          role: 'user',
          content: `Identify the sentiment of the feedback (positive, neutral, negative). 
            When the sentiment is positive, return 'POSITIVE', is neutral, return 'NEUTRAL', is negative, return 'NEGATIVE'.
            Do not provide explanation.`,
        },
      );

      const sentimentResponse = await this.chat(messages);
      const sentiment = (sentimentResponse.choices[0].message.content || '').trim();
      this.logger.log(`sentiment -> ${sentiment}`);

      messages.push(
        {
          role: 'assistant',
          content: sentiment,
        },
        {
          role: 'user',
          content: `Identify the topic of the feedback. Keep the number of sub-topics to 3 or less. Do not provide explanation.`,
        },
      );

      const topicResponse = await this.chat(messages);
      const topic = (topicResponse.choices[0].message.content || '').trim();
      this.logger.log(`topic -> ${topic}`);

      messages.push(
        {
          role: 'assistant',
          content: topic,
        },
        {
          role: 'user',
          content: `The customer wrote a ${sentiment} feedback about ${topic} in ${language}.
          Please give a short reply in the same language. Do not do more and provide English translation.`,
        },
      );

      const replyResponse = await this.chat(messages);
      const reply = (replyResponse.choices[0].message.content || '').trim();
      this.logger.log(reply);

      return reply;
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

  private async chat(messages: { role: string; content: string }[]) {
    return this.hfInference.chatCompletion({
      accessToken: env.HUGGINGFACE.API_KEY,
      model: env.HUGGINGFACE.MODEL_NAME,
      temperature: 0.1,
      top_p: 0.5,
      max_tokens: 1024,
      messages,
    });
  }
}
