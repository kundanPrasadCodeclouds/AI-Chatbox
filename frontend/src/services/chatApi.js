import axios from 'axios';
import { API_BASE_URL } from '../config/api.js';

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
    const apiMessage = error.response?.data?.message;
    throw new Error(
      apiMessage || 'The AI service is taking a break. Please try again.'
    );
  }
};
