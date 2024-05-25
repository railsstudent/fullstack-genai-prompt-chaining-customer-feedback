import { StringOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { GEMINI_CHAT_MODEL } from './constants/gemini.constant';

// https://www.kaggle.com/code/marcinrutecki/langchain-multiple-chains-simply-explained

@Injectable()
export class AdvisoryFeedbackPromptChainingService {
  private readonly logger = new Logger(AdvisoryFeedbackPromptChainingService.name);

  constructor(@Inject(GEMINI_CHAT_MODEL) private model: ChatGoogleGenerativeAI) {}

  // three chains:
  // chain 1: find the language of the feedback
  // chain 2: identity the sentiment of the feedback
  // chain 3: identity the topic of the feedback
  // chain 4: combine chain 1, 2 and 3 into a new chain. Then, address the topic and reply in the same language
  private createFindLanguageChain() {
    const languageTemplate = `What is the language of this feedback? 
    If the feedback is written in Chinese, please differentiate Traditional Chinese and Simplified Chinese. 
    Please give me the language name, and nothing else.
    Feedback: {feedback}`;
    const languagePrompt = PromptTemplate.fromTemplate<{ feedback: string }>(languageTemplate);

    return languagePrompt.pipe(this.model).pipe(new StringOutputParser());
  }

  private createTopicChain() {
    const topicTemplate = 'What is the topic of this feedback? Feedback: {feedback}';
    const topicPrompt = PromptTemplate.fromTemplate<{ feedback: string }>(topicTemplate);

    return topicPrompt.pipe(this.model).pipe(new StringOutputParser());
  }

  private createSentimentChain() {
    const sentimentTemplate = `What is the sentiment of this feedback?
    When the sentiment is positive, return 'POSITIVE', is neutral, return 'NEUTRAL', is negative, return 'NEGATIVE'. 
    Feedback: {feedback}`;
    const sentimentPrompt = PromptTemplate.fromTemplate<{ feedback: string }>(sentimentTemplate);

    return sentimentPrompt.pipe(this.model).pipe(new StringOutputParser());
  }

  async generateFeedback(prompt: string): Promise<string> {
    try {
      const languageChain = this.createFindLanguageChain();
      const sentimentChain = this.createSentimentChain();
      const topicChain = this.createTopicChain();

      const feedbackPrompt = PromptTemplate.fromTemplate(`
        The customer wrote a {sentiment} feedback about {topic} in {language}. Feedback: {feedback}
        Please give a short reply in the same language. 
      `);

      const combinedChain = RunnableSequence.from([
        {
          language: languageChain,
          sentiment: sentimentChain,
          topic: topicChain,
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
