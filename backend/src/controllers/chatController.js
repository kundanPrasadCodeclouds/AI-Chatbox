import { generateChatReply } from '../services/huggingFaceService.js';

export const chatController = async (req, res, next) => {
  try {
    const reply = await generateChatReply(req.body.message);

    return res.status(200).json({
      reply
    });
  } catch (error) {
    return next(error);
  }
};
