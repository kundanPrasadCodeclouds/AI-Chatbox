import { env } from '../config/env.js';
import { huggingFaceConfig } from '../config/huggingFace.js';

// Hugging Face can return JSON errors or plain text responses, so parse safely.
const parseJsonSafely = async (response) => {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
};

// Builds the OpenAI-compatible request body used by Hugging Face's router API.
export const createChatPayload = (message, overrides = {}) => ({
  model: huggingFaceConfig.model,
  messages: [
    {
      role: 'system',
      content:
        'You are a helpful, concise AI assistant. Answer clearly and naturally.'
    },
    {
      role: 'user',
      content: message
    }
  ],
  ...huggingFaceConfig.generationOptions,
  ...overrides
});

// Keeps response parsing in one place in case the provider response changes later.
export const extractGeneratedText = (payload) => {
  const reply = payload?.choices?.[0]?.message?.content;

  if (typeof reply === 'string') {
    return reply.trim();
  }

  return '';
};

export const callHuggingFaceChat = async (message, overrides = {}) => {
  if (env.debugHuggingFace) {
    // This log intentionally excludes the API token.
    console.log('[HF Debug] Sending chat request', {
      endpoint: huggingFaceConfig.endpoint,
      model: huggingFaceConfig.model,
      maxTokens: overrides.max_tokens ?? huggingFaceConfig.generationOptions.max_tokens
    });
  }

  const response = await fetch(huggingFaceConfig.endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${huggingFaceConfig.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(createChatPayload(message, overrides))
  });

  const payload = await parseJsonSafely(response);

  return {
    ok: response.ok,
    status: response.status,
    payload
  };
};

// Used by npm run doctor:hf to confirm the token is valid without printing it.
export const checkHuggingFaceToken = async () => {
  const response = await fetch('https://huggingface.co/api/whoami-v2', {
    headers: {
      Authorization: `Bearer ${huggingFaceConfig.token}`
    }
  });

  return {
    ok: response.ok,
    status: response.status,
    payload: await parseJsonSafely(response)
  };
};
