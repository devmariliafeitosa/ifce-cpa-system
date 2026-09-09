const ACTION_PATTERN = /^[A-Z_]+: /;

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

function buildAction(action, description, date = new Date()) {
  if (typeof action !== 'string' || !/^[A-Z_]+$/.test(action.trim())) {
    throw new TypeError('Action should have only upper and lowercase chars');
  }

  if (typeof description !== 'string' || !description.trim()) {
    throw new TypeError('description required');
  }

  const timestamp = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(timestamp.getTime())) throw new TypeError('timestamp invalid');

  return `${action.trim()}: ${description.trim()} - ${formatarDataHora(timestamp)}`;
}

function isValidAction(value) {
  if (typeof value !== 'string' || !ACTION_PATTERN.test(value)) return false;

  const separatorIndex = value.lastIndexOf(' - ');

  return separatorIndex > value.indexOf(': ') && separatorIndex < value.length - 3;
}

module.exports = { buildAction, isValidAction };