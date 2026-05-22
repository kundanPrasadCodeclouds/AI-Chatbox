import { huggingFaceConfig } from '../config/huggingFace.js';
import {
  callHuggingFaceChat,
  extractGeneratedText
} from './huggingFaceClient.js';

export const generateChatReply = async (message) => {
  if (!huggingFaceConfig.token) {
    const error = new Error('Hugging Face API token is not configured.');
    error.statusCode = 500;
    throw error;
  }

  let result;

  try {
    result = await callHuggingFaceChat(message);
  } catch (error) {
    const serviceError = new Error(
      'Unable to reach Hugging Face right now. Please check your internet connection or try again shortly.'
    );
    serviceError.statusCode = 503;
    serviceError.cause = error;
    throw serviceError;
  }

  if (!result.ok) {
    const error = new Error(
      result.payload.error?.message ||
        result.payload.error ||
        'The AI service is temporarily unavailable.'
    );
    error.statusCode = result.status >= 500 ? 502 : result.status;
    throw error;
  }

  const reply = extractGeneratedText(result.payload);

  if (!reply) {
    const error = new Error('The AI service returned an empty response.');
    error.statusCode = 502;
    throw error;
  }

  return reply;
};
