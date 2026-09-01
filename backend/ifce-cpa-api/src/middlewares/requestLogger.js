const logsService = require('../services/logsService');

function requestLogger(req, res, next) {

  const originalSend = res.send;

  res.send = function (data) {
    const userId = req.user?.uid || req.user?.id || req.user?.userId;
    const method = req.method;
    const path = req.path;
    const statusCode = res.statusCode;

    if (userId) {
      
      let actionType = 'READ';
      if (method === 'POST') actionType = 'CREATE';
      else if (method === 'PUT' || method === 'PATCH') actionType = 'UPDATE';
      else if (method === 'DELETE') actionType = 'DELETE';

      const description = `${method} ${path} - Status: ${statusCode}`;
      logsService.recordAction(userId, actionType, description);
    }

    return originalSend.call(this, data);
  };

  next();
}

module.exports = { requestLogger };