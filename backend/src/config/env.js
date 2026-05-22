import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  debugHuggingFace: process.env.DEBUG_HUGGING_FACE === 'true',
  huggingFaceApiToken: process.env.HUGGING_FACE_API_TOKEN || '',
  huggingFaceModel:
    process.env.HUGGING_FACE_MODEL || 'katanemo/Arch-Router-1.5B:hf-inference',
  huggingFaceApiUrl:
    process.env.HUGGING_FACE_API_URL ||
    'https://router.huggingface.co/v1/chat/completions'
};
