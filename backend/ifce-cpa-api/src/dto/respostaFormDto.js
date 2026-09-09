function validarEnvioResposta(body) {
  const { formId, answers } = body;
  const erros = [];

  if (!formId || typeof formId !== 'string') {
    erros.push('formId é obrigatório e deve ser string');
  }

  if (!Array.isArray(answers) || answers.length === 0) {
    erros.push('answers é obrigatório e deve ser um array não vazio');
  } else {
    answers.forEach((item, index) => {
      if (!item.questionId || typeof item.questionId !== 'string') {
        erros.push(`answers[${index}].questionId é obrigatório`);
      }
      if (item.value === undefined || item.value === null) {
        erros.push(`answers[${index}].value é obrigatório`);
      }
    });
  }

  if (erros.length > 0) {
    const erro = new Error(erros.join('; '));
    erro.status = 400;
    throw erro;
  }

  return { formId, answers };
}

module.exports = { validarEnvioResposta };