const logsRepository = require('../repositories/logsRepository');
const { buildAction } = require('../models/logs');

const VALID_ACTIONS = new Set(['CREATE', 'UPDATE', 'DELETE', 'AUTH', 'RESPONSE', 'READ', 'ERROR']);

function validateAction(action) {
  if (typeof action !== 'string' || !action.trim()) {
    throw new TypeError('Action must be a non-empty string');
  }

  const upper = action.trim().toUpperCase();

  if (!VALID_ACTIONS.has(upper)) {
    throw new TypeError(`Invalid action: ${action}`);
  }

  return upper;
}

// Aceita tanto formato posicional: recordAction(userId, action, description, timestamp)
// quanto formato objeto: recordAction({ userId, tipo, descricao, timestamp })
async function recordAction(userIdOrPayload, action, description, timestamp = new Date()) {
  let userId, actionRaw, descriptionRaw, timestampRaw;

  if (typeof userIdOrPayload === 'object' && userIdOrPayload !== null) {
    userId = userIdOrPayload.userId;
    actionRaw = userIdOrPayload.tipo || userIdOrPayload.action;
    descriptionRaw = userIdOrPayload.descricao || userIdOrPayload.description;
    timestampRaw = userIdOrPayload.timestamp || new Date();
  } else {
    userId = userIdOrPayload;
    actionRaw = action;
    descriptionRaw = description;
    timestampRaw = timestamp;
  }

  if (!userId) {
    console.error('Failed to record log: userId missing');
    return null;
  }

  if (!actionRaw || !descriptionRaw) {
    console.error('Failed to record log: action and description are required');
    return null;
  }

  try {
    const validatedAction = validateAction(actionRaw);
    const actionText = buildAction(validatedAction, descriptionRaw, timestampRaw);

    console.log(`[LOG] USER ${userId} ${validatedAction} ${descriptionRaw}`);

    await logsRepository.adicionarAcao(userId, actionText);

    return { userId, action: validatedAction, description: descriptionRaw, timestamp: timestampRaw };
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
        lastAction: logData.actions[logData.actions.length - 1] || null,
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

    return allLogs.map((log) => ({
      ...log,
      actionsCount: log.actions ? log.actions.length : 0,
      lastAction: log.actions ? log.actions[log.actions.length - 1] : null,
    }));
  } catch (err) {
    console.error('Failed to fetch logs:', err.message);
    return [];
  }
}

const registrarLog = recordAction;
const buscarLogsUsuario = getUserLog;

module.exports = { recordAction, getUserLog, getLogs, registrarLog, buscarLogsUsuario };