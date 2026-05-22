export const notFoundHandler = (req, res) => {
  res.status(404).json({
    message: `Route ${req.method} ${req.originalUrl} not found.`
  });
};

export const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  if (res.headersSent) {
    return next(error);
  }

  console.error('[API Error]', {
    path: req.originalUrl,
    method: req.method,
    statusCode,
    message: error.message,
    cause: error.cause?.message
  });

  return res.status(statusCode).json({
    message:
      statusCode === 500
        ? 'Something went wrong while processing your request.'
        : error.message
  });
};
