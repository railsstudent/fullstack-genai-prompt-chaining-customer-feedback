import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || '3000'),
  GEMINI: {
    API_KEY: process.env.GOOGLE_GEMINI_API_KEY || '',
    MODEL_NAME: process.env.GOOGLE_GEMINI_MODEL || 'gemini-pro',
  },
};
