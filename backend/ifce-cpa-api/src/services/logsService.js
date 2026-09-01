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
    return await logsRepository.buscarLogsPorUsuario(userId);
  } catch (err) {
    console.error('Failed to fetch log:', err.message);
    return null;
  }
}

async function getLogs() {
  try {
    return await logsRepository.buscarTodosLogs();
  } catch (err) {
    console.error('Failed to fetch logs:', err.message);
    return [];
  }
}

const registrarLog = recordAction;
const buscarLogsUsuario = getUserLog;

module.exports = { recordAction, getUserLog, getLogs, registrarLog, buscarLogsUsuario };