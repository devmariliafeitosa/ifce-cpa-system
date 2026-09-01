// src/services/logsService.js
const logsRepository = require('../repositories/logsRepository');
const { buildAction, isValidAction } = require('../models/logs');

const VALID_ACTIONS = new Set(['CREATE', 'UPDATE', 'DELETE', 'AUTH', 'RESPONSE', 'READ', 'ERROR']);

async function recordAction(userId, action, description, timestamp = new Date()) {
  if (!userId) {
    console.error('Failed to record log: userId missing');
    return null;
  }

  if (!action || !description) {
    console.error('Failed to record log: action and description are required');
    return null;
  }

  const validatedAction = validateAction(action);
  
  try {
    const actionText = buildAction(validatedAction, description, timestamp);
    console.log(`[LOG] USER ${userId} ${validatedAction} ${description}`);
    await logsRepository.adicionarAcao(userId, actionText);
    return { userId, action: validatedAction, description, timestamp };
  } catch (err) {
    console.error('Failed to record log:', err.message);
    return null;
  }
}

async function getUserLog(userId) {
  if (!userId) {
    console.error('Failed to fetch log: userId missing');
    return null;
  }

  try {
    const logData = await logsRepository.buscarLogsPorUsuario(userId);
    
    if (logData?.actions) {
      return {
        ...logData,
        actionsCount: logData.actions.length,
        lastAction: logData.actions[logData.actions.length - 1] || null
      };
    }
    
    return logData;
  } catch (err) {
    console.error('Failed to fetch log:', err.message);
    return null;
  }
}

async function getLogs() {
  try {
    const allLogs = await logsRepository.buscarTodosLogs();
    
    return allLogs.map(log => ({
      ...log,
      actionsCount: log.actions ? log.actions.length : 0,
      lastAction: log.actions ? log.actions[log.actions.length - 1] : null
    }));
  } catch (err) {
    console.error('Failed to fetch logs:', err.message);
    return [];
  }
}

const registrarLog = recordAction;
const buscarLogsUsuario = getUserLog;

module.exports = { recordAction, getUserLog, getLogs, registrarLog, buscarLogsUsuario };