function validarCriacaoRelacao(body) {
  const { formId, questionId } = body;
  const erros = [];

  if (!formId || typeof formId !== 'string') {
    erros.push('formId é obrigatório e deve ser string');
  }

  if (!questionId || typeof questionId !== 'string') {
    erros.push('questionId é obrigatório e deve ser string');
  }

  if (erros.length > 0) {
    const erro = new Error(erros.join('; '));
    erro.status = 400;
    throw erro;
  }

  return { formId, questionId };
}

module.exports = { validarCriacaoRelacao };