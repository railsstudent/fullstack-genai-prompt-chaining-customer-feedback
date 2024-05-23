import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || '3001'),
  GEMINI: {
    API_KEY: process.env.GROQ_API_KEY || '',
    MODEL_NAME: process.env.GROQ_MODEL || 'llama3-8b-8192',
  },
};
