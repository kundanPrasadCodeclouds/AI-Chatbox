import { env } from './env.js';

export const huggingFaceConfig = {
  model: env.huggingFaceModel,
  endpoint: env.huggingFaceApiUrl,
  token: env.huggingFaceApiToken,
  generationOptions: {
    max_tokens: 280,
    temperature: 0.7,
    top_p: 0.9
  }
};
