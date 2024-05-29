import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || '3003'),
  HUGGINGFACE: {
    API_KEY: process.env.HUGGINGFACE_API_KEY || '',
    MODEL_NAME: process.env.HUGGINGFACE_MODEL || 'google/gemma-2b',
  },
};
