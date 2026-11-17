function notFound(req, res) {
  res.status(404).json({ error: { message: 'Route not found.' } });
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({ error: { message: 'Invalid request.' } });
  }
  if (error.code === 11000) {
    return res.status(409).json({ error: { message: 'An account with that email already exists.' } });
  }
  if (error.name === 'ZodError') {
    return res.status(400).json({
      error: { message: 'Request validation failed.', details: error.issues.map(i => ({ field: i.path.join('.'), message: i.message })) }
    });
  }
  if (process.env.NODE_ENV !== 'test') console.error(error);
  return res.status(500).json({ error: { message: 'An unexpected error occurred.' } });
}

module.exports = { notFound, errorHandler };
