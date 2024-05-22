import { Inject } from '@nestjs/common';
import {
  GEMINI_ADVISORY_FEEDBACK_MODEL,
  GEMINI_FIND_LANGUAGE_MODEL,
  GEMINI_SENTIMENT_ANALYSIS_MODEL,
} from '../constants/gemini.constant';

export function injectAnalysisModel() {
  return Inject(GEMINI_SENTIMENT_ANALYSIS_MODEL);
}

export function injectFeedbackModel() {
  return Inject(GEMINI_ADVISORY_FEEDBACK_MODEL);
}

export function injectFindLanguageModel() {
  return Inject(GEMINI_FIND_LANGUAGE_MODEL);
}
