const errorHandler = (err, _, res) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;
