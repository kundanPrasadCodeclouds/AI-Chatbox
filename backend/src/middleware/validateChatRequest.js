const MAX_MESSAGE_LENGTH = 2000;

export const validateChatRequest = (req, res, next) => {
  const { message } = req.body;

  // Validate before calling Hugging Face so invalid requests fail fast and cheaply.
  if (typeof message !== 'string') {
    return res.status(400).json({
      message: 'Message is required and must be a string.'
    });
  }

  const trimmedMessage = message.trim();

  if (!trimmedMessage) {
    return res.status(400).json({
      message: 'Message cannot be empty.'
    });
  }

  if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({
      message: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`
    });
  }

  // Store the cleaned message for the controller/service layer.
  req.body.message = trimmedMessage;
  return next();
};
