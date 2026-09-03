const STATUS_VALIDOS = ['rascunho', 'publicado', 'encerrado'];

function validarCriacaoForm(body) {
  const { title, description, campusId, startDate, endDate, startTime, endTime, status, isAtivo } = body;
  const erros = [];

  if (!title || typeof title !== 'string') {
    erros.push('title é obrigatório e deve ser string');
  }

  if (!campusId || typeof campusId !== 'string') {
    erros.push('campusId é obrigatório e deve ser string');
  }

  if (!startDate || typeof startDate !== 'string') {
    erros.push('startDate é obrigatório e deve ser string');
  }

  if (!endDate || typeof endDate !== 'string') {
    erros.push('endDate é obrigatório e deve ser string');
  }

  if (status !== undefined && !STATUS_VALIDOS.includes(status)) {
    erros.push(`status inválido: ${status}`);
  }

  if (isAtivo !== undefined && typeof isAtivo !== 'boolean') {
    erros.push('isAtivo deve ser boolean');
  }

  if (erros.length > 0) {
    const erro = new Error(erros.join('; '));
    erro.status = 400;
    throw erro;
  }

  return {
    title,
    description: description || '',
    campusId,
    startDate,
    endDate,
    startTime: startTime || '',
    endTime: endTime || '',
    status: status || 'rascunho',
    isAtivo: isAtivo ?? false,
  };
}

function validarAtualizacaoForm(body) {
  const permitidos = ['title', 'description', 'campusId', 'startDate', 'endDate', 'startTime', 'endTime', 'status', 'isAtivo'];
  const dados = {};

  for (const campo of permitidos) {
    if (body[campo] !== undefined) dados[campo] = body[campo];
  }

  if (dados.status !== undefined && !STATUS_VALIDOS.includes(dados.status)) {
    const erro = new Error(`status inválido: ${dados.status}`);
    erro.status = 400;
    throw erro;
  }

  if (Object.keys(dados).length === 0) {
    const erro = new Error('Nenhum campo válido para atualizar');
    erro.status = 400;
    throw erro;
  }

  return dados;
}

module.exports = { validarCriacaoForm, validarAtualizacaoForm };