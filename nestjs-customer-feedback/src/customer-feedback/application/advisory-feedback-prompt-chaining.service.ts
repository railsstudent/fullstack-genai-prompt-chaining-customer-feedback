import { GenerativeModel } from '@google/generative-ai';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { GEMINI_ADVISORY_FEEDBACK_MODEL, GEMINI_SENTIMENT_ANALYSIS_MODEL } from './constants/gemini.constant';
import { SentimentAnalysis } from './types/sentiment-analysis.type';

@Injectable()
export class AdvisoryFeedbackPromptChainingService {
  private readonly logger = new Logger(AdvisoryFeedbackPromptChainingService.name);

  constructor(
    @Inject(GEMINI_SENTIMENT_ANALYSIS_MODEL) private analysisModel: GenerativeModel,
    @Inject(GEMINI_ADVISORY_FEEDBACK_MODEL) private feedbackModel: GenerativeModel,
  ) {}

  async generateSentinment(prompt: string): Promise<SentimentAnalysis> {
    try {
      const result = await this.analysisModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      this.logger.log(text);
      return JSON.parse(text) as SentimentAnalysis;
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

  async generateFeedback(prompt: string, { sentiment, topic }: SentimentAnalysis) {
    try {
      const chainedPrompt = `
        The customer wrote a ${sentiment} feedback about ${topic}. Provided feedback: ${prompt}.
        Feedback: 
        `;

      this.logger.log(chainedPrompt);
      const result = await this.feedbackModel.generateContent(chainedPrompt);
      const response = await result.response;
      const text = response.text();
      this.logger.log(text);
      return text;
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }
}
