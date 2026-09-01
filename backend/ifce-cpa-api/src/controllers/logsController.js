const logsService = require('../services/logsService');

function handleError(res, error) {
  if (error instanceof TypeError) return res.status(400).json({ error: error.message });
  console.error(error);
  return res.status(500).json({ error: 'Log could not be processed' });
}

async function create(req, res) {
    try {
        const { action, description, timestamp } = req.body || {};
        const userId = req.user && (req.user.uid || req.user.id || req.user.userId);
        const log = await logsService.recordAction(userId, action, description, timestamp);
        return res.status(201).json(log);
  
    } catch (error) {
        return handleError(res, error);
    }
}

async function getByUser(req, res) {
    try {
        const log = await logsService.getUserLog(req.params.userId);
        return log ? res.json(log) : res.status(404).json({ error: 'No Log found for this user' });
    
    } catch (error) {
        return handleError(res, error);
    }
}

async function list(req, res) {
    try {
        return res.json(await logsService.getLogs());
    } catch (error) {
        return handleError(res, error);
    }
}

module.exports = { create, getByUser, list };