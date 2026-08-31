const campusesRepository = require('../repositories/campusesRepository');
const { registrarLog } = require('./logsServices');

async function criarCampus({ nome, sigla, ativo = true }, criadoPor) {
  if (!nome || !sigla) {
    throw new Error('Nome e sigla do campus são obrigatórios');
  }

  const existente = await campusesRepository.buscarCampusPorId(nome);
  if (existente) {
    throw new Error(`Já existe um campus cadastrado com o nome "${nome}"`);
  }

  await campusesRepository.criarCampus(nome, { nome, sigla, ativo });

  await registrarLog({
    userId: criadoPor,
    tipo: 'CREATE',
    descricao: `criou o campus ${nome} (${sigla})`,
  });

  return nome;
}

async function buscarCampus(idCampus) {
  return campusesRepository.buscarCampusPorId(idCampus);
}

async function listarCampuses(filtros) {
  return campusesRepository.listarCampuses(filtros);
}

async function atualizarCampus(idCampus, dados, atualizadoPor) {
  const existente = await campusesRepository.buscarCampusPorId(idCampus);
  if (!existente) {
    throw new Error(`Campus "${idCampus}" não encontrado`);
  }

  await campusesRepository.atualizarCampus(idCampus, dados);

  await registrarLog({
    userId: atualizadoPor,
    tipo: 'UPDATE',
    descricao: `atualizou o campus ${idCampus}`,
  });
}

async function desativarCampus(idCampus, desativadoPor) {
  await campusesRepository.atualizarCampus(idCampus, { ativo: false });

  await registrarLog({
    userId: desativadoPor,
    tipo: 'UPDATE',
    descricao: `desativou o campus ${idCampus}`,
  });
}

module.exports = {
  criarCampus,
  buscarCampus,
  listarCampuses,
  atualizarCampus,
  desativarCampus,
};