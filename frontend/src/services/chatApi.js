import axios from 'axios';
import { API_BASE_URL } from '../config/api.js';

// The frontend only talks to our backend; API keys must never be exposed here.
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const sendChatMessage = async (message) => {
  try {
    const { data } = await apiClient.post('/chat', { message });
    return data.reply;
  } catch (error) {
    // Prefer backend validation/provider messages, then fall back to a friendly default.
    const apiMessage = error.response?.data?.message;
    throw new Error(
      apiMessage || 'The AI service is taking a break. Please try again.'
    );
  }
};
