const AUDIENCES_VALIDAS = [
  'aluno',
  'docente',
  'servidor',
  'coordenador',
];

const TIPOS_VALIDOS = [
  'multipla_escolha',
  'texto_livre',
  'escala',
  'sim_nao',
];

const STUDENT_LEVELS_VALIDOS = [
  'todos',
  'tecnico',
  'graduacao',
  'mestrado',
  'pos_graduacao',
];

function validarCriacaoQuestion(body) {
  const { title, audiences, type, options, order, required, studentLevel } = body;
  const erros = [];

  if (!title || typeof title !== 'string') {
    erros.push('title é obrigatório e deve ser string');
  }

  if (!Array.isArray(audiences) || audiences.length === 0) {
    erros.push('audiences é obrigatório e deve ser um array não vazio');
  } else {
    const invalida = audiences.find((a) => !AUDIENCES_VALIDAS.includes(a));
    if (invalida) {
      erros.push(`audience inválida: ${invalida}`);
    }
  }

  if (!TIPOS_VALIDOS.includes(type)) {
    erros.push(`type inválido: ${type}`);
  }

  if (
    type === 'multipla_escolha' &&
    (!Array.isArray(options) || options.length < 2)
  ) {
    erros.push('options precisa ter ao menos 2 itens para multipla_escolha');
  }

  if (order !== undefined && typeof order !== 'number') {
    erros.push('order deve ser number');
  }

  if (required !== undefined && typeof required !== 'boolean') {
    erros.push('required deve ser boolean');
  }

  if (
    studentLevel !== undefined &&
    !STUDENT_LEVELS_VALIDOS.includes(studentLevel)
  ) {
    erros.push(`studentLevel inválido: ${studentLevel}`);
  }

  if (erros.length > 0) {
    const erro = new Error(erros.join('; '));
    erro.status = 400;
    throw erro;
  }

  return {
    title: title.trim(),
    audiences,
    type,
    options: options || [],
    order: order ?? 0,
    required: required ?? false,
    studentLevel: studentLevel ?? 'todos',
  };
}

function validarAtualizacaoQuestion(body) {
  const permitidos = [
    'title',
    'audiences',
    'type',
    'options',
    'order',
    'required',
    'studentLevel',
  ];

  const dados = {};
  const erros = [];

  for (const campo of permitidos) {
    if (body[campo] !== undefined) {
      dados[campo] = body[campo];
    }
  }

  if (Object.keys(dados).length === 0) {
    const erro = new Error('Nenhum campo válido para atualizar');
    erro.status = 400;
    throw erro;
  }

  if (dados.title !== undefined) {
    if (typeof dados.title !== 'string' || !dados.title.trim()) {
      erros.push('title deve ser uma string não vazia');
    } else {
      dados.title = dados.title.trim();
    }
  }

  if (dados.audiences !== undefined) {
    if (!Array.isArray(dados.audiences) || dados.audiences.length === 0) {
      erros.push('audiences deve ser um array não vazio');
    } else {
      const audienciaInvalida = dados.audiences.find(
        (audience) => !AUDIENCES_VALIDAS.includes(audience)
      );
      if (audienciaInvalida) {
        erros.push(`audience inválida: ${audienciaInvalida}`);
      }
    }
  }

  if (dados.type !== undefined) {
    if (!TIPOS_VALIDOS.includes(dados.type)) {
      erros.push(`type inválido: ${dados.type}`);
    }
  }

  if (dados.options !== undefined) {
    if (!Array.isArray(dados.options)) {
      erros.push('options deve ser um array');
    } else {
      const opcaoInvalida = dados.options.some(
        (option) => typeof option !== 'string' || !option.trim()
      );
      if (opcaoInvalida) {
        erros.push('Todas as options devem ser strings não vazias');
      } else {
        dados.options = dados.options.map((option) => option.trim());
      }
    }
  }

  if (
    dados.type === 'multipla_escolha' &&
    dados.options !== undefined &&
    dados.options.length < 2
  ) {
    erros.push('options precisa ter ao menos 2 itens para multipla_escolha');
  }

  if (
    dados.order !== undefined &&
    (typeof dados.order !== 'number' || !Number.isFinite(dados.order))
  ) {
    erros.push('order deve ser um número válido');
  }

  if (dados.required !== undefined && typeof dados.required !== 'boolean') {
    erros.push('required deve ser boolean');
  }

  if (
    dados.studentLevel !== undefined &&
    !STUDENT_LEVELS_VALIDOS.includes(dados.studentLevel)
  ) {
    erros.push(`studentLevel inválido: ${dados.studentLevel}`);
  }

  if (erros.length > 0) {
    const erro = new Error(erros.join('; '));
    erro.status = 400;
    throw erro;
  }

  return dados;
}

module.exports = {
  validarCriacaoQuestion,
  validarAtualizacaoQuestion,
  AUDIENCES_VALIDAS,
  TIPOS_VALIDOS,
  STUDENT_LEVELS_VALIDOS,
};