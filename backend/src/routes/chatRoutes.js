import { Router } from 'express';
import { chatController } from '../controllers/chatController.js';
import { validateChatRequest } from '../middleware/validateChatRequest.js';

const router = Router();

router.post('/chat', validateChatRequest, chatController);

export default router;
