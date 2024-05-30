import { HfInference } from '@huggingface/inference';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { env } from '~configs/env.config';
import { HUGGINGFACE_INFERENCE } from './constants/huggingface.constant';

@Injectable()
export class AdvisoryFeedbackPromptChainingService {
  private readonly logger = new Logger(AdvisoryFeedbackPromptChainingService.name);

  constructor(@Inject(HUGGINGFACE_INFERENCE) private hfInference: HfInference) {}

  async generateFeedback(feedback: string): Promise<string> {
    try {
      const chatLanguage = await this.hfInference.chatCompletion({
        accessToken: env.HUGGINGFACE.API_KEY,
        model: env.HUGGINGFACE.MODEL_NAME,
        temperature: 0.1,
        top_p: 0.5,
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: `What is the language used to write the feedback? Give me the language name, no explanation, no formal response.
            When the feedback is written in Traditional Chinese, return Traditional Chinese. When the feedback is written in 
            Simplified Chinese, return Simplified Chinese.
            `,
          },
          {
            role: 'assistant',
            content: 'What is the feedback?',
          },
          {
            role: 'user',
            content: feedback,
          },
        ],
      });

      const language = (chatLanguage.choices[0].message.content || '').trim();
      console.log(language);

      const chatSentiment = await this.hfInference.chatCompletion({
        accessToken: env.HUGGINGFACE.API_KEY,
        model: env.HUGGINGFACE.MODEL_NAME,
        temperature: 0.1,
        top_p: 0.5,
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: `Identify the sentiment and topic of feedback and return the JSON output { "sentiment": string, "topic": string }.
            When the sentiment is positive, return 'POSITIVE', is neutral, return 'NEUTRAL', is negative, return 'NEGATIVE'.
            Keep the sub-topics 3 or less.
            Do not provide explanation for either fields.
            `,
          },
          {
            role: 'assistant',
            content: 'What is the feedback?',
          },
          {
            role: 'user',
            content: feedback,
          },
        ],
      });

      try {
        const strSentiment = (chatSentiment.choices[0].message.content || '{}').trim();
        const jsonData = JSON.parse(strSentiment);
        console.log(jsonData);
      } catch {
        console.log({});
      }

      return Promise.resolve(feedback);
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }
}
