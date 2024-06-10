import { Inject, Injectable, Logger } from '@nestjs/common';
import Groq from 'groq-sdk';
import { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions';
import { MODEL_CONFIG } from './configs/groq.config';
import { GROQ_CHAT_MODEL } from './constants/groq.constant';
import { SentimentAnalysis } from './types/sentiment-analysis.type';

@Injectable()
export class AdvisoryFeedbackPromptChainingService {
  private readonly logger = new Logger(AdvisoryFeedbackPromptChainingService.name);
  private chatbot = this.groq.completions;

  constructor(@Inject(GROQ_CHAT_MODEL) private groq: Groq.Chat) {}

  async generateReply(feedback: string): Promise<string> {
    try {
      const instruction = `You are a professional ESG advisor who can reply in the same language as the customer's feedback. 
    The reply is short and should also address the sentiment and topics of the feedback.`;

      const messages: ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: instruction,
        },
        {
          role: 'user',
          content: `Please identify the language used in the feedback. Give me the language name, and nothing else.
        If the language is Chinese, please specify Traditional Chinese or Simplified Chinese. 
        If you do not know the language, give 'Unknown'.
        Feedback: ${feedback}
        `,
        },
      ];

      const response = await this.chatbot.create({
        ...MODEL_CONFIG,
        messages,
      });
      const language = response.choices?.[0]?.message?.content || '';
      this.logger.log(language);

      messages.push(
        { role: 'assistant', content: language },
        {
          role: 'user',
          content: `Identify the sentiment and topic of feedback and return the JSON output { "sentiment": 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE', "topic": string }.`,
        },
      );

      const analysis = await this.chatbot.create({
        ...MODEL_CONFIG,
        messages,
      });
      const jsonAnalysis = JSON.parse(analysis.choices?.[0]?.message?.content || '') as SentimentAnalysis;
      const { sentiment, topic } = jsonAnalysis;
      this.logger.log(`sentiment -> ${sentiment}, topic -> ${topic}`);

      const chainedPrompt = `The customer wrote a ${sentiment} feedback about ${topic} in ${language}. Please give a short reply.`;
      messages.push(
        { role: 'assistant', content: `The sentiment is ${sentiment} and the topics are ${topic}` },
        { role: 'user', content: chainedPrompt },
      );

      this.logger.log(chainedPrompt);
      this.logger.log(messages);
      const result = await this.chatbot.create({
        ...MODEL_CONFIG,
        messages,
      });

      const text = result.choices[0]?.message?.content || '';
      this.logger.log(`text -> ${text}`);
      return text;
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }
}
