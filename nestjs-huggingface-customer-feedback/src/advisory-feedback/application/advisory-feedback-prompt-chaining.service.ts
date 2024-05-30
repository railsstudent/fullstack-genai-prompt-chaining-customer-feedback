import { HfInference } from '@huggingface/inference';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { HUGGINGFACE_CHAT_PARAMETERS, HUGGINGFACE_INFERENCE } from './constants/huggingface.constant';
import { env } from '~configs/env.config';
import { ChatComputInputParameters } from './providers/huggingface-chat-parameters.provider';

@Injectable()
export class AdvisoryFeedbackPromptChainingService {
  private readonly logger = new Logger(AdvisoryFeedbackPromptChainingService.name);

  constructor(
    @Inject(HUGGINGFACE_INFERENCE) private hfInference: HfInference,
    @Inject(HUGGINGFACE_CHAT_PARAMETERS) private chatParameters: ChatComputInputParameters,
  ) {}

  // // three chains:
  // // chain 1: find the language of the feedback
  // // chain 2: identity the sentiment of the feedback
  // // chain 3: identity the topic of the feedback
  // // chain 4: combine chain 1, 2 and 3 into a new chain. Then, address the topic and reply in the same language
  // private createFindLanguageChain() {
  //   const languageTemplate = `What is the language of this feedback?
  //   If the feedback is written in Chinese, please differentiate Traditional Chinese and Simplified Chinese.
  //   Please give me the language name, and nothing else. Delete the trailing newline character
  //   Feedback: {feedback}`;
  //   const languagePrompt = PromptTemplate.fromTemplate<CustomerFeedback>(languageTemplate);

  //   return languagePrompt.pipe(this.model).pipe(new StringOutputParser());
  // }

  // private createTopicChain() {
  //   const topicTemplate = `What is the topic of this feedback?
  //   Just the topic and explanation is not needed. Delete the trailing newline character
  //   Feedback: {feedback}`;
  //   const topicPrompt = PromptTemplate.fromTemplate<CustomerFeedback>(topicTemplate);

  //   return topicPrompt.pipe(this.model).pipe(new StringOutputParser());
  // }

  // private createSentimentChain() {
  //   const sentimentTemplate = `What is the sentiment of this feedback? No explaination is needed.
  //   When the sentiment is positive, return 'POSITIVE', is neutral, return 'NEUTRAL', is negative, return 'NEGATIVE'.
  //   Feedback: {feedback}`;
  //   const sentimentPrompt = PromptTemplate.fromTemplate<CustomerFeedback>(sentimentTemplate);

  //   return sentimentPrompt.pipe(this.model).pipe(new StringOutputParser());
  // }

  async generateFeedback(feedback: string): Promise<string> {
    try {
      this.hfInference.chatCompletion({
        model: env.HUGGINGFACE.MODEL_NAME,
        messages: [],
        ...this.chatParameters,
      });
      // const chainMap = RunnableMap.from<CustomerFeedback>({
      //   language: this.createFindLanguageChain(),
      //   sentiment: this.createSentimentChain(),
      //   topic: this.createTopicChain(),
      //   feedback: ({ feedback }) => feedback,
      // });

      // const feedbackPrompt =
      //   PromptTemplate.fromTemplate(`The customer wrote a {sentiment} feedback about {topic} in {language}. Feedback: {feedback}
      //   Please give a short reply in the same language.`);

      // const combinedChain = RunnableSequence.from([chainMap, feedbackPrompt, this.model, new StringOutputParser()]);

      // const response = await combinedChain.invoke({
      //   feedback,
      // });

      // this.logger.log(response);

      // return response;
      return Promise.resolve(feedback);
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }
}