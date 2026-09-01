const logsService = require('../services/logsService');

function requestLogger(req, res, next) {
  const originalSend = res.send;

  res.send = async function (data) {
    const userId = req.user?.uid || req.user?.id || req.user?.userId;
    const method = req.method;
    const path = req.path;
    const statusCode = res.statusCode;

    if (userId) {
      try {
        let actionType = 'READ';
        if (method === 'POST') actionType = 'CREATE';
        else if (method === 'PUT' || method === 'PATCH') actionType = 'UPDATE';
        else if (method === 'DELETE') actionType = 'DELETE';

        const description = `${method} ${path} - Status: ${statusCode}`;
        await logsService.recordAction(userId, actionType, description);
      } catch (err) {
        console.error('[RequestLogger] Error recording log:', err.message);
      }
    }

    return originalSend.call(this, data);
  };

  next();
}

module.exports = { requestLogger };