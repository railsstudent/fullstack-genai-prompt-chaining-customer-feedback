import { Inject, Injectable, Logger } from '@nestjs/common';
import Groq from 'groq-sdk';
import { MODEL_CONFIG } from './configs/groq.config';
import { GROQ_CHAT_COMPLETIONS } from './constants/groq.constant';
import { SentimentAnalysis } from './types/sentiment-analysis.type';

@Injectable()
export class AdvisoryFeedbackPromptChainingService {
  private readonly logger = new Logger(AdvisoryFeedbackPromptChainingService.name);

  constructor(@Inject(GROQ_CHAT_COMPLETIONS) private groqChatCompletions: Groq.Chat.Completions) {}

  async generateFeedback(prompt: string): Promise<string> {
    const instruction =
      "You are a professional ESG advisor, please give a short reply to customer's response and in the same language.";

    try {
      const [analysis, language] = await Promise.all([this.analyseSentinment(prompt), this.findLanguage(prompt)]);
      const { sentiment, topic } = analysis;
      const chainedPrompt = `
        The customer wrote a ${sentiment} feedback about ${topic} in ${language}. Provided feedback: ${prompt}.
        Feedback: 
      `;

      this.logger.log(chainedPrompt);
      const result = await this.groqChatCompletions.create({
        messages: this.constructMessages(instruction, chainedPrompt),
        ...MODEL_CONFIG,
      });

      const text = result.choices[0]?.message?.content || '';
      this.logger.log(text);
      return text;
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

  private constructMessages(instruction: string, prompt: string): Groq.Chat.Completions.ChatCompletionMessageParam[] {
    return [
      {
        role: 'system',
        content: instruction,
      },
      {
        role: 'user',
        content: prompt,
      },
    ];
  }

  private async findLanguage(prompt: string): Promise<string> {
    const instruction = `You are a multilingual expert that can identify the language used in this piece of text. Give me the language name, and nothing else.
  If the text is written in Chinese, please differentiate Traditional Chinese and Simplified Chinese. 
  `;

    try {
      const response = await this.groqChatCompletions.create({
        messages: this.constructMessages(instruction, prompt),
        ...MODEL_CONFIG,
      });

      return response.choices[0]?.message?.content || '';
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

  private async analyseSentinment(prompt: string): Promise<SentimentAnalysis> {
    const instruction = `
    You are a sentiment analysis assistant who can identify the sentiment and topic of feedback and return the JSON output { "sentiment": string, "topic": string }.
    When the sentiment is positive, return 'POSITIVE', is neutral, return 'NEUTRAL', is negative, return 'NEGATIVE'.
    `;

    try {
      const response = await this.groqChatCompletions.create({
        messages: this.constructMessages(instruction, prompt),
        ...MODEL_CONFIG,
        response_format: {
          type: 'json_object',
        },
      });

      return JSON.parse(response.choices[0]?.message?.content || '') as SentimentAnalysis;
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }
}
