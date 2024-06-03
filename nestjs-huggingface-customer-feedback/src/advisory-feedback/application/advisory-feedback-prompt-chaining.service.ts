import { HfInference } from '@huggingface/inference';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { env } from '~configs/env.config';
import { HUGGINGFACE_INFERENCE } from './constants/huggingface.constant';
import { ChatMessage } from './types/chat-message.type';
import { Conversation } from './types/conversation:type';

@Injectable()
export class AdvisoryFeedbackPromptChainingService {
  private readonly logger = new Logger(AdvisoryFeedbackPromptChainingService.name);

  constructor(@Inject(HUGGINGFACE_INFERENCE) private hfInference: HfInference) {}

  async generateFeedback(feedback: string): Promise<string> {
    try {
      const messages: ChatMessage[] = [];
      this.appendMessages(messages, {
        query: `What is the language used to write the feedback? Give me the language name, no explanation, no formal response.
      When the feedback is written in Traditional Chinese, return Traditional Chinese. When the feedback is written in 
      Simplified Chinese, return Simplified Chinese.`,
      });
      this.appendMessages(messages, { previousAnswer: 'What is the feedback?', query: feedback });

      const response = await this.chat(messages);
      const language = response.replace('.', '');
      this.logger.log(`language -> ${language}`);

      this.appendMessages(messages, {
        previousAnswer: language,
        query: `Identify the sentiment of the feedback (positive, neutral, negative). 
      When the sentiment is positive, return 'POSITIVE', is neutral, return 'NEUTRAL', is negative, return 'NEGATIVE'.
      Do not provide explanation.`,
      });
      const sentiment = await this.chat(messages);
      this.logger.log(`sentiment -> ${sentiment}`);

      this.appendMessages(messages, {
        previousAnswer: sentiment,
        query: `Identify the topic of the feedback. Keep the number of sub-topics to 3 or less. Do not provide explanation.`,
      });
      const topic = await this.chat(messages);
      this.logger.log(`topic -> ${topic}`);

      this.appendMessages(messages, {
        previousAnswer: topic,
        query: `The customer wrote a ${sentiment} feedback about ${topic} in ${language}. Please give a short reply in the same language. Do not do more and provide English translation.`,
      });
      const reply = await this.chat(messages);
      this.logger.log(reply);

      return reply;
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

  private appendMessages(messages: ChatMessage[], { previousAnswer = '', query }: Conversation): void {
    if (previousAnswer) {
      messages.push({
        role: 'assistant',
        content: previousAnswer,
      });
    }

    messages.push({
      role: 'user',
      content: query,
    });
  }

  private async chat(messages: ChatMessage[]): Promise<string> {
    const response = await this.hfInference.chatCompletion({
      accessToken: env.HUGGINGFACE.API_KEY,
      model: env.HUGGINGFACE.MODEL_NAME,
      temperature: 0.5,
      top_p: 0.5,
      max_tokens: 1024,
      messages,
    });

    return (response.choices?.[0]?.message?.content || '').trim();
  }
}
