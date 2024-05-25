import { JsonOutputParser, StringOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { GEMINI_CHAT_MODEL } from './constants/gemini.constant';
import { RunnableSequence } from '@langchain/core/runnables';

type RunnableFeedbackInput = {
  feedback: string;
};

@Injectable()
export class AdvisoryFeedbackPromptChainingService {
  private readonly logger = new Logger(AdvisoryFeedbackPromptChainingService.name);

  constructor(@Inject(GEMINI_CHAT_MODEL) private model: ChatGoogleGenerativeAI) {}

  // three chains:
  // chain 1: find the language of the feedback
  // chain 2: identity the sentiment and topic of the feedback
  // chain 3: combine chain 1 and 2 into a new chain. Then, address the topic and reply in the same language
  private createFindLanguageChain() {
    const languageTemplate = `What is the language of this feedback? 
    If the feedback is written in Chinese, please differentiate Traditional Chinese and Simplified Chinese. 
    Please give me the language name, and nothing else.
    Feedback: {feedback}`;
    const languagePrompt = PromptTemplate.fromTemplate<{ feedback: string }>(languageTemplate);

    return languagePrompt.pipe(this.model).pipe(new StringOutputParser());
  }

  private createSentimentChain() {
    const sentimentTemplate = `What are the sentiment and topic of this feedback? Please give result in JSON { "sentiment": string, "topic": string }.
    When the sentiment is positive, return 'POSITIVE', is neutral, return 'NEUTRAL', is negative, return 'NEGATIVE'. 
    Feedback: {feedback}`;
    const sentimentPrompt = PromptTemplate.fromTemplate<{ feedback: string }>(sentimentTemplate);

    return sentimentPrompt.pipe(this.model).pipe(new JsonOutputParser());
  }

  async generateFeedback(prompt: string): Promise<string> {
    try {
      const languageChain = this.createFindLanguageChain();
      const sentimentChain = this.createSentimentChain();

      const feedbackPrompt = PromptTemplate.fromTemplate(`
        The customer wrote a {sentiment} feedback about {topic} in {language}. Feedback: {feedback}
        Please give a short reply in the same language. 
      `);

      const combinedChain = RunnableSequence.from<RunnableFeedbackInput>([
        {
          language: languageChain,
          analysis: sentimentChain,
          feedback: (input) => input.feedback,
        },
        feedbackPrompt,
        this.model,
        new StringOutputParser(),
      ]);

      const response = await combinedChain.invoke({
        feedback: prompt,
      });

      this.logger.log(response);

      return response;
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }
}
