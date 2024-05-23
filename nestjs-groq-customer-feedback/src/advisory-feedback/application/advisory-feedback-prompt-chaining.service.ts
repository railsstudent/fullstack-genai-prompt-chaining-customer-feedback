import { Inject, Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';
import { GROQ } from './constants/groq.constant';

@Injectable()
export class AdvisoryFeedbackPromptChainingService {
  constructor(@Inject(GROQ) private groq: Groq) {
    console.log(this.groq);
  }
}
