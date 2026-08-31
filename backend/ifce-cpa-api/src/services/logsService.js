// src/services/logsServices.js
const logsRepository = require('../repositories/logsRepository');

const TIPOS_VALIDOS = ['CREATE', 'UPDATE', 'DELETE', 'AUTH', 'RESPONSE'];

function formatarDataHora(date = new Date()) {
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Fortaleza',
  });
}

async function registrarLog({ userId, tipo, descricao }) {
  if (!userId) {
    console.error('Falha ao registrar log: userId ausente');
    return;
  }

  const tipoFinal = TIPOS_VALIDOS.includes(tipo) ? tipo : 'INFO';
  const textoAcao = `${tipoFinal} : ${descricao} - ${formatarDataHora()}`;
  console.log(`[LOG] USER ${userId} ${tipoFinal} ${descricao}`);

  try {
    await logsRepository.adicionarAcao(userId, textoAcao);
  } catch (err) {
    console.error('Falha ao registrar log:', err.message);
  }
}

async function buscarLogsUsuario(userId) {
  return logsRepository.buscarLogsPorUsuario(userId);
}

module.exports = { registrarLog, buscarLogsUsuario };