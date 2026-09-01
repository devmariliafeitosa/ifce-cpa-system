const { dbPrincipal } = require('../config/database');

function getRoleCollection(role) {
  return dbPrincipal.collection(role); // 'aluno' | 'docente' | 'servidor' | 'coordenador'
}

async function criarDadosRole(role, userId, dados) {
  await getRoleCollection(role).doc(userId).set(dados);
}

async function buscarDadosRole(role, userId) {
  const doc = await getRoleCollection(role).doc(userId).get();
  if (!doc.exists) return null;
  return doc.data();
}

async function atualizarDadosRole(role, userId, dados) {
  await getRoleCollection(role).doc(userId).update(dados);
}

async function removerDadosRole(role, userId) {
  await getRoleCollection(role).doc(userId).delete();
}

module.exports = { criarDadosRole, buscarDadosRole, atualizarDadosRole, removerDadosRole };