const handleServerError = ({ res, error }) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
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

const handleRouteErrors = (fn) => {
  if (typeof fn !== 'function') {
    throw new TypeError(`Expected function, got ${typeof fn}`);
  }

  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = {
  handleServerError,
  handleMissingRequestBody,
  validateRequiredParams,
  handleRouteErrors,
}