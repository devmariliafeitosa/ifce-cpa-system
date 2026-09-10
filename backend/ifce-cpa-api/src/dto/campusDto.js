function validarCriacaoCampus(body) {
  const { nome, sigla, ativo } = body;
  const erros = [];

  if (!nome || typeof nome !== 'string' || !nome.trim()) {
    erros.push('nome é obrigatório e deve ser string');
  }

  if (!sigla || typeof sigla !== 'string' || !sigla.trim()) {
    erros.push('sigla é obrigatória e deve ser string');
  }

  if (ativo !== undefined && typeof ativo !== 'boolean') {
    erros.push('ativo deve ser boolean');
  }

  if (erros.length > 0) {
    const erro = new Error(erros.join('; '));
    erro.status = 400;
    throw erro;
  }

  return {
    nome: nome.trim(),
    sigla: sigla.trim(),
    ativo: ativo ?? true,
  };
}

function validarAtualizacaoCampus(body) {
  const permitidos = ['sigla', 'ativo'];
  const dados = {};

  for (const campo of permitidos) {
    if (body[campo] !== undefined) dados[campo] = body[campo];
  }

  if (body.nome !== undefined) {
    const erro = new Error(
      'Não é possível alterar o nome do campus por aqui (é o id do documento). Crie um novo campus se precisar renomear.'
    );
    erro.status = 400;
    throw erro;
  }

  if (dados.ativo !== undefined && typeof dados.ativo !== 'boolean') {
    const erro = new Error('ativo deve ser boolean');
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

module.exports = { validarCriacaoCampus, validarAtualizacaoCampus };