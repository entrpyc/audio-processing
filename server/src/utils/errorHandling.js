const handleServerError = ({ res, error }) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Server crashed' });
}

const handleMissingRequestBody = (res) => {
  res.status(400).json({ error: 'Missing request body. Submit valid json.' });
}

const validateRequiredParams = (res, params) => {
  const missingParams = Object.keys(params).filter(key => params[key] === undefined || params[key] === null);

  if(missingParams.length) {
    res.status(400).json({ error: `Missing params: ${missingParams.join(', ')}` });
    return false;
  }

  return true;
}

module.exports = {
  handleServerError,
  handleMissingRequestBody,
  validateRequiredParams,
}