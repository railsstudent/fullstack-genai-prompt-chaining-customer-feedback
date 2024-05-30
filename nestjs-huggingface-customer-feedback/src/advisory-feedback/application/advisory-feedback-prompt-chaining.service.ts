import { HfInference } from '@huggingface/inference';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { env } from '~configs/env.config';
import { HUGGINGFACE_INFERENCE } from './constants/huggingface.constant';
import { SentimentAnalysis } from './types/sentiment-analysis.type';

@Injectable()
export class AdvisoryFeedbackPromptChainingService {
  private readonly logger = new Logger(AdvisoryFeedbackPromptChainingService.name);

  constructor(@Inject(HUGGINGFACE_INFERENCE) private hfInference: HfInference) {}

  async generateFeedback(feedback: string): Promise<string> {
    try {
      const [language, sentiment] = await Promise.all([this.findLanguage(feedback), this.analyseSentinment(feedback)]);
      this.logger.log(language);
      this.logger.log(JSON.stringify(sentiment));

      const instruction = `The customer wrote a ${sentiment.sentiment} feedback about ${sentiment.topic} in ${language}.
      Please give a short reply in the same language. No need to provide back to English.`;
      this.logger.log(instruction);

      const options = this.createChatOptions({
        instruction,
        feedback,
      });
      const chatReply = await this.hfInference.chatCompletion(options);

      const reply = (chatReply.choices[0].message.content || '').trim();
      this.logger.log(reply);

      return Promise.resolve(reply);
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

  private createChatOptions(messages: { instruction: string; feedback: string }) {
    return {
      accessToken: env.HUGGINGFACE.API_KEY,
      model: env.HUGGINGFACE.MODEL_NAME,
      temperature: 0.1,
      top_p: 0.5,
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: messages.instruction,
        },
        {
          role: 'assistant',
          content: 'What is the feedback?',
        },
        {
          role: 'user',
          content: messages.feedback,
        },
      ],
    };
  }

  private async analyseSentinment(feedback: string): Promise<SentimentAnalysis> {
    const options = this.createChatOptions({
      instruction: `Identify the sentiment and topic of feedback and return the JSON output { "sentiment": string, "topic": string }.
      When the sentiment is positive, return 'POSITIVE', is neutral, return 'NEUTRAL', is negative, return 'NEGATIVE'.
      Keep the sub-topics 3 or less. Do not provide explanation for either fields.
      `,
      feedback,
    });
    const chatSentiment = await this.hfInference.chatCompletion(options);
    const strSentiment = (chatSentiment.choices[0].message.content || '{}').trim();
    return JSON.parse(strSentiment);
  }

  private async findLanguage(feedback: string): Promise<string> {
    const options = this.createChatOptions({
      instruction: `What is the language used to write the feedback? Give me the language name, no explanation, no formal response.
      When the feedback is written in Traditional Chinese, return Traditional Chinese. When the feedback is written in 
      Simplified Chinese, return Simplified Chinese.`,
      feedback,
    });
    const chatLanguage = await this.hfInference.chatCompletion(options);
    return (chatLanguage.choices[0].message.content || '').replace('.', '').trim();
  }
}
