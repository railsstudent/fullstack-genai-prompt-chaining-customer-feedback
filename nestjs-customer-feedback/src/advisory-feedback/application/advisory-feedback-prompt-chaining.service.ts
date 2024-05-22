import { GenerativeModel } from '@google/generative-ai';
import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  GEMINI_ADVISORY_FEEDBACK_MODEL,
  GEMINI_FIND_LANGUAGE_MODEL,
  GEMINI_SENTIMENT_ANALYSIS_MODEL,
} from './constants/gemini.constant';
import { SentimentAnalysis } from './types/sentiment-analysis.type';

@Injectable()
export class AdvisoryFeedbackPromptChainingService {
  private readonly logger = new Logger(AdvisoryFeedbackPromptChainingService.name);

  constructor(
    @Inject(GEMINI_SENTIMENT_ANALYSIS_MODEL) private analysisModel: GenerativeModel,
    @Inject(GEMINI_ADVISORY_FEEDBACK_MODEL) private feedbackModel: GenerativeModel,
    @Inject(GEMINI_FIND_LANGUAGE_MODEL) private findLanguageModel: GenerativeModel,
  ) {}

  async generateFeedback(prompt: string) {
    try {
      const [analysis, language] = await Promise.all([this.analyseSentinment(prompt), this.findLanguage(prompt)]);
      const { sentiment, topic } = analysis;
      const chainedPrompt = `
        The customer wrote a ${sentiment} feedback about ${topic} in ${language}. Provided feedback: ${prompt}.
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

  private async analyseSentinment(prompt: string): Promise<SentimentAnalysis> {
    try {
      const result = await this.analysisModel.generateContent(prompt);
      const response = await result.response;
      return JSON.parse(response.text()) as SentimentAnalysis;
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

  private async findLanguage(prompt: string): Promise<string> {
    try {
      const languageResult = await this.findLanguageModel.generateContent(prompt);
      const languageResponse = await languageResult.response;
      return languageResponse.text();
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }
}
