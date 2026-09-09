const AUDIENCES_VALIDAS = ['aluno', 'docente', 'servidor', 'coordenador'];
const TIPOS_VALIDOS = ['multipla_escolha', 'texto_livre', 'escala', 'sim_nao'];

function validarCriacaoQuestion(body) {
  const { title, audiences, type, options, order, required } = body;
  const erros = [];

  if (!title || typeof title !== 'string') {
    erros.push('title é obrigatório e deve ser string');
  }

  if (!Array.isArray(audiences) || audiences.length === 0) {
    erros.push('audiences é obrigatório e deve ser um array não vazio');
  } else {
    const invalida = audiences.find((a) => !AUDIENCES_VALIDAS.includes(a));
    if (invalida) erros.push(`audience inválida: ${invalida}`);
  }

  if (!TIPOS_VALIDOS.includes(type)) {
    erros.push(`type inválido: ${type}`);
  }

  if (type === 'multipla_escolha' && (!Array.isArray(options) || options.length < 2)) {
    erros.push('options precisa ter ao menos 2 itens para multipla_escolha');
  }

  if (order !== undefined && typeof order !== 'number') {
    erros.push('order deve ser number');
  }

  if (required !== undefined && typeof required !== 'boolean') {
    erros.push('required deve ser boolean');
  }

  if (erros.length > 0) {
    const erro = new Error(erros.join('; '));
    erro.status = 400;
    throw erro;
  }

  return {
    title,
    audiences,
    type,
    options: options || [],
    order: order ?? 0,
    required: required ?? false,
  };
}

function validarAtualizacaoQuestion(body) {
  const permitidos = ['title', 'audiences', 'type', 'options', 'order', 'required'];
  const dados = {};

  for (const campo of permitidos) {
    if (body[campo] !== undefined) dados[campo] = body[campo];
  }

  if (Object.keys(dados).length === 0) {
    const erro = new Error('Nenhum campo válido para atualizar');
    erro.status = 400;
    throw erro;
  }

  return dados;
}

module.exports = { validarCriacaoQuestion, validarAtualizacaoQuestion };