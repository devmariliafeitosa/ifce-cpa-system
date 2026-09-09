const ROLES_VALIDOS = ['aluno', 'docente', 'servidor', 'coordenador'];

const CAMPOS_POR_ROLE = {
  aluno: ['curso', 'matricula', 'semestre'],
  docente: ['siape'],
  servidor: ['siape'],
  coordenador: ['siape'],
};

function validarCriacaoUsuario(body) {
  const { nome, email, campusId, roles, ativo, dadosPorRole } = body;
  const erros = [];

  if (!nome || typeof nome !== 'string') {
    erros.push('nome é obrigatório e deve ser string');
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    erros.push('email é obrigatório e deve ser um e-mail válido');
  }

  if (!campusId || typeof campusId !== 'string') {
    erros.push('campusId é obrigatório e deve ser string');
  }

  if (!Array.isArray(roles) || roles.length === 0) {
    erros.push('roles é obrigatório e deve ser um array não vazio');
  } else {
    const invalido = roles.find((r) => !ROLES_VALIDOS.includes(r));
    if (invalido) erros.push(`role inválido: ${invalido}`);
  }

  if (ativo !== undefined && typeof ativo !== 'boolean') {
    erros.push('ativo deve ser boolean');
  }

  if (Array.isArray(roles)) {
    for (const role of roles) {
      if (!CAMPOS_POR_ROLE[role]) continue;
      const dadosRole = dadosPorRole?.[role];
      const faltando = CAMPOS_POR_ROLE[role].filter((campo) => dadosRole?.[campo] === undefined);
      if (faltando.length > 0) {
        erros.push(`dadosPorRole.${role} está faltando: ${faltando.join(', ')}`);
      }
    }
  }

  if (erros.length > 0) {
    const erro = new Error(erros.join('; '));
    erro.status = 400;
    throw erro;
  }

  return {
    nome,
    email,
    campusId,
    roles,
    ativo: ativo ?? true,
    dadosPorRole: dadosPorRole || {},
  };
}

function validarAtualizacaoUsuario(body) {
  const permitidos = ['nome', 'email', 'campusId', 'ativo', 'roles'];
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

module.exports = { validarCriacaoUsuario, validarAtualizacaoUsuario };