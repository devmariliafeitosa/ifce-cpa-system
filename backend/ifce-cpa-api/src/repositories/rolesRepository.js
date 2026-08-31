const { dbPrincipal } = require('../config/database');
const usersRepository = require('../repositories/usersRepository');
const roleRepository = require('../repositories/roleRepository');
const { registrarLog } = require('./logsServices');

const ROLES_VALIDOS = ['alunos', 'docente', 'servidor', 'coordenador'];

const CAMPOS_POR_ROLE = {
  alunos: ['curso', 'matricula', 'semestre'],
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
  for (const role of usuario.roles) {
    dadosRoles[role] = await roleRepository.buscarDadosRole(role, userId);
  }

  return { ...usuario, dadosRoles };
}

module.exports = { criarUsuario, buscarUsuarioCompleto };