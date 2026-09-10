const { dbPrincipal } = require('../config/database');
const usersRepository = require('../repositories/usersRepository');
const roleRepository = require('../repositories/rolesRepository');
const { registrarLog } = require('./logsService');

const ROLES_VALIDOS = ['aluno', 'docente', 'servidor', 'coordenador'];

const CAMPOS_POR_ROLE = {
  aluno: ['curso', 'matricula', 'semestre'],
  docente: ['siape'],
  servidor: ['siape'],
  coordenador: ['siape'],
};

function validarRoles(roles) {
  if (!Array.isArray(roles) || roles.length === 0) {
    throw new Error('O usuário precisa ter ao menos um role válido');
  }
  const invalido = roles.find((r) => !ROLES_VALIDOS.includes(r));
  if (invalido) {
    throw new Error(`Role inválido: ${invalido}`);
  }
}

function validarDadosRole(role, dados) {
  const camposObrigatorios = CAMPOS_POR_ROLE[role];
  const faltando = camposObrigatorios.filter((campo) => dados?.[campo] === undefined);
  if (faltando.length > 0) {
    throw new Error(`Dados do role "${role}" incompletos: faltando ${faltando.join(', ')}`);
  }
}

async function criarUsuario({ nome, email, campusId, roles, ativo = true, dadosPorRole = {}, criadoPor }) {
  validarRoles(roles);
  roles.forEach((role) => validarDadosRole(role, dadosPorRole[role]));

  const campusRef = dbPrincipal.collection('campuses').doc(campusId);

  const userId = await usersRepository.criarUsuario({
    nome,
    email,
    ativo,
    campusId: campusRef,
    roles,
  });

  for (const role of roles) {
    await roleRepository.criarDadosRole(role, userId, dadosPorRole[role]);
  }

  await registrarLog({
    userId: criadoPor || userId,
    tipo: 'CREATE',
    descricao: `criou o usuário ${nome} (${roles.join(', ')})`,
  });

  return userId;
}

async function buscarUsuarioCompleto(userId) {
  const usuario = await usersRepository.buscarUsuarioPorId(userId);
  if (!usuario) return null;

  const dadosRoles = {};
  for (const role of usuario.roles || []) {
    dadosRoles[role] = await roleRepository.buscarDadosRole(role, userId);
  }

  return { ...usuario, dadosRoles };
}

async function listarUsuarios() {
  const usuarios = await usersRepository.listarUsuarios();

  return Promise.all(
    usuarios.map(async (usuario) => {
      const dadosRoles = {};
      for (const role of usuario.roles || []) {
        dadosRoles[role] = await roleRepository.buscarDadosRole(role, usuario.id);
      }
      return { ...usuario, dadosRoles };
    })
  );
}

async function sincronizarRoles({ userId, rolesAntigos, rolesNovos, dadosPorRole = {} }) {
  const antigos = new Set(rolesAntigos);
  const novos = new Set(rolesNovos);

  const rolesParaCriar = rolesNovos.filter((r) => !antigos.has(r));
  const rolesParaRemover = rolesAntigos.filter((r) => !novos.has(r));
  const rolesParaAtualizar = rolesNovos.filter((r) => antigos.has(r) && dadosPorRole[r]);

  for (const role of rolesParaCriar) {
    validarDadosRole(role, dadosPorRole[role]);
    await roleRepository.criarDadosRole(role, userId, dadosPorRole[role]);
  }

  for (const role of rolesParaRemover) {
    await roleRepository.removerDadosRole(role, userId);
  }

  for (const role of rolesParaAtualizar) {
    await roleRepository.atualizarDadosRole(role, userId, dadosPorRole[role]);
  }
}

async function atualizarUsuario(userId, dados, atualizadoPor) {
  const existente = await usersRepository.buscarUsuarioPorId(userId);
  if (!existente) {
    throw new Error(`Usuário "${userId}" não encontrado`);
  }

  const { dadosPorRole, roles, campusId, ...camposSimples } = dados;

  const dadosParaSalvar = { ...camposSimples };

  if (campusId) {
    dadosParaSalvar.campusId = dbPrincipal.collection('campuses').doc(campusId);
  }

  const rolesAntigos = existente.roles || [];
  const rolesNovos = roles || rolesAntigos;

  if (roles) {
    validarRoles(roles);
    dadosParaSalvar.roles = roles;
  }

  if (Object.keys(dadosParaSalvar).length > 0) {
    await usersRepository.atualizarUsuario(userId, dadosParaSalvar);
  }

  if (roles || dadosPorRole) {
    await sincronizarRoles({
      userId,
      rolesAntigos,
      rolesNovos,
      dadosPorRole: dadosPorRole || {},
    });
  }

  await registrarLog({
    userId: atualizadoPor,
    tipo: 'UPDATE',
    descricao: `atualizou o usuário ${existente.nome}`,
  });
}

async function desativarUsuario(userId, desativadoPor) {
  await usersRepository.atualizarUsuario(userId, { ativo: false });

  await registrarLog({
    userId: desativadoPor,
    tipo: 'UPDATE',
    descricao: `desativou o usuário ${userId}`,
  });
}

module.exports = {
  criarUsuario,
  buscarUsuarioCompleto,
  listarUsuarios,
  atualizarUsuario,
  desativarUsuario,
};