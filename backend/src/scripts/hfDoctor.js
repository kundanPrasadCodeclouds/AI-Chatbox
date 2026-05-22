import { env } from '../config/env.js';
import { huggingFaceConfig } from '../config/huggingFace.js';
import {
  callHuggingFaceChat,
  checkHuggingFaceToken,
  extractGeneratedText
} from '../services/huggingFaceClient.js';
import { maskSecret } from '../utils/maskSecret.js';

// This script is a safe setup checklist for new developers.
// It validates configuration, credentials, and model support without exposing secrets.
const printStep = (title) => {
  console.log(`\n[Step] ${title}`);
};

const printPass = (message, details = {}) => {
  console.log('PASS:', message, details);
};

const printFail = (message, details = {}) => {
  console.error('FAIL:', message, details);
};

const assertEnvShape = () => {
  printStep('Checking local environment variables');

  // Keep enough detail for debugging while masking the sensitive token value.
  const checks = {
    nodeVersion: process.version,
    nodeEnv: env.nodeEnv,
    port: env.port,
    clientOrigin: env.clientOrigin,
    endpoint: huggingFaceConfig.endpoint,
    model: huggingFaceConfig.model,
    token: maskSecret(huggingFaceConfig.token),
    tokenLooksLikeHfToken: huggingFaceConfig.token.startsWith('hf_')
  };

  if (!huggingFaceConfig.token) {
    printFail('HUGGING_FACE_API_TOKEN is missing.');
    process.exitCode = 1;
    return false;
  }

  if (!huggingFaceConfig.token.startsWith('hf_')) {
    printFail('Token is present, but it does not look like a Hugging Face token.', {
      token: checks.token
    });
    process.exitCode = 1;
    return false;
  }

  try {
    new URL(huggingFaceConfig.endpoint);
  } catch {
    printFail('HUGGING_FACE_API_URL is not a valid URL.', {
      endpoint: huggingFaceConfig.endpoint
    });
    process.exitCode = 1;
    return false;
  }

  printPass('Environment shape looks valid.', checks);
  return true;
};

const assertTokenWorks = async () => {
  printStep('Checking Hugging Face token credentials');

  // whoami-v2 confirms that the token is valid before we test the model.
  const result = await checkHuggingFaceToken();

  if (!result.ok) {
    printFail('Hugging Face rejected the token.', {
      status: result.status,
      error: result.payload.error || result.payload.message || result.payload
    });
    process.exitCode = 1;
    return false;
  }

  printPass('Token is valid.', {
    status: result.status,
    user: result.payload.name || result.payload.fullname || 'authenticated'
  });
  return true;
};

const assertModelWorks = async () => {
  printStep('Checking router endpoint, model, and provider support');

  // A tiny completion proves the selected model/provider combination is usable.
  const result = await callHuggingFaceChat('Say hello in one short sentence.', {
    max_tokens: 30
  });

  if (!result.ok) {
    printFail('Chat completion request failed.', {
      status: result.status,
      error: result.payload.error?.message || result.payload.error || result.payload
    });
    process.exitCode = 1;
    return false;
  }

  const reply = extractGeneratedText(result.payload);

  if (!reply) {
    printFail('Chat completion succeeded but returned no assistant text.', {
      status: result.status,
      payloadKeys: Object.keys(result.payload)
    });
    process.exitCode = 1;
    return false;
  }

  printPass('Model responded successfully.', {
    status: result.status,
    model: result.payload.model || huggingFaceConfig.model,
    reply
  });
  return true;
};

const main = async () => {
  console.log('Hugging Face Doctor');
  console.log('This command masks secrets and never prints the full token.');

  if (!assertEnvShape()) {
    return;
  }

  try {
    const tokenOk = await assertTokenWorks();

    if (!tokenOk) {
      return;
    }

    await assertModelWorks();
  } catch (error) {
    printFail('Network or runtime error while checking Hugging Face.', {
      message: error.message,
      cause: error.cause?.message
    });
    process.exitCode = 1;
  }
};

main();
