export const GEMINI_SENTIMENT_ANALYSIS_MODEL = 'GEMINI_SENTIMENT_ANALYSIS_MODEL';
export const SENTIMENT_ANALYSIS_SYSTEM_INSTRUCTION = `
    You are a sentiment analysis assistant who can identify the sentiment and topic of feedback and return the JSON output { "sentiment": string, "topic": string }.  
    When the sentiment is positive, return 'POSITIVE', is neutral, return 'NEUTRAL', is negative, return 'NEGATIVE'.
`;

export const GEMINI_ADVISORY_FEEDBACK_MODEL = 'GEMINI_ADVISORY_FEEDBACK_MODEL';
export const ADVISORY_FEEDBACK_SYSTEM_INSTRUCTION =
  "You are a professional ESG advisor, please give a short reply to customer's response.";
