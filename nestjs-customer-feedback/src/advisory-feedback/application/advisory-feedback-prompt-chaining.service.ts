import { GenerativeModel } from '@google/generative-ai';
import { Injectable, Logger } from '@nestjs/common';
import { SentimentAnalysis } from './types/sentiment-analysis.type';
import { injectAnalysisModel, injectFeedbackModel, injectFindLanguageModel } from './injectors/models.injector';

@Injectable()
export class AdvisoryFeedbackPromptChainingService {
  private readonly logger = new Logger(AdvisoryFeedbackPromptChainingService.name);

  constructor(
    @injectAnalysisModel() private analysisModel: GenerativeModel,
    @injectFeedbackModel() private feedbackModel: GenerativeModel,
    @injectFindLanguageModel() private findLanguageModel: GenerativeModel,
  ) {}

  private async generateSentinment(prompt: string): Promise<SentimentAnalysis> {
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

  async generateFeedback(prompt: string) {
    try {
      const [{ sentiment, topic }, language] = await Promise.all([
        this.generateSentinment(prompt),
        this.findLanguage(prompt),
      ]);

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

  private async findLanguage(prompt: string): Promise<string> {
    const languageResult = await this.findLanguageModel.generateContent(prompt);
    const languageResponse = await languageResult.response;
    const language = languageResponse.text();
    return language;
  }
}
