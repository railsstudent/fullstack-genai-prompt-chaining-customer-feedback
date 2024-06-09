import { StringOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableMap, RunnableSequence } from '@langchain/core/runnables';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { GEMINI_CHAT_MODEL } from './constants/gemini.constant';
import { ChainOutput } from './types/chain-output.type';
import { CustomerFeedback } from './types/customer-feedback.type';

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
    When the feedback is written in Traditional Chinese, return Traditional Chinese. When the feedback is written in 
    Simplified Chinese, return Simplified Chinese.
    Please give me the language name, and nothing else. Delete the trailing newline character
    Feedback: {feedback}`;
    const languagePrompt = PromptTemplate.fromTemplate<CustomerFeedback>(languageTemplate);

    return languagePrompt.pipe(this.model).pipe(new StringOutputParser());
  }

  private createTopicChain() {
    const topicTemplate = `What is the topic of this feedback?
    Just the topic and explanation is not needed. Delete the trailing newline character
    Feedback: {feedback}`;
    const topicPrompt = PromptTemplate.fromTemplate<CustomerFeedback>(topicTemplate);

    return topicPrompt.pipe(this.model).pipe(new StringOutputParser());
  }

  private createSentimentChain() {
    const sentimentTemplate = `What is the sentiment of this feedback? No explaination is needed.
    When the sentiment is positive, return 'POSITIVE', is neutral, return 'NEUTRAL', is negative, return 'NEGATIVE'.
    Feedback: {feedback}`;
    const sentimentPrompt = PromptTemplate.fromTemplate<CustomerFeedback>(sentimentTemplate);

    return sentimentPrompt.pipe(this.model).pipe(new StringOutputParser());
  }

  async generateReply(feedback: string): Promise<string> {
    try {
      const chainMap = RunnableMap.from<CustomerFeedback>({
        language: this.createFindLanguageChain(),
        sentiment: this.createSentimentChain(),
        topic: this.createTopicChain(),
        feedback: ({ feedback }) => feedback,
      });

      const replyPrompt =
        PromptTemplate.fromTemplate(`The customer wrote a {sentiment} feedback about {topic} in {language}. Feedback: {feedback}
        Please give a short reply in the same language.`);

      const combinedChain = RunnableSequence.from([chainMap, replyPrompt, this.model, new StringOutputParser()]);

      const response = await combinedChain.invoke({
        feedback,
      });

      this.logger.log(response);

      return response;
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }

  async testChains(feedback: string): Promise<ChainOutput> {
    const chains = [this.createFindLanguageChain(), this.createSentimentChain(), this.createTopicChain()].map((c) =>
      c.invoke({ feedback }),
    );
    const [language, sentiment, topic] = await Promise.all(chains);

    return {
      language,
      sentiment,
      topic,
    };
  }

  async testRunnableMap(feedback: string): Promise<Record<string, any>> {
    const chainMap = RunnableMap.from<CustomerFeedback>({
      language: this.createFindLanguageChain(),
      sentiment: this.createSentimentChain(),
      topic: this.createTopicChain(),
      feedback: ({ feedback }) => feedback,
    });

    return chainMap.invoke({ feedback });
  }
}
