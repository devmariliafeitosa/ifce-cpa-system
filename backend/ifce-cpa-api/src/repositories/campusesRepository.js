const { dbPrincipal } = require('../config/database');

const campusesCollection = dbPrincipal.collection('campuses');

async function criarCampus(idCampus, dados) {
  await campusesCollection.doc(idCampus).set(dados);
  return idCampus;
}

async function buscarCampusPorId(idCampus) {
  const doc = await campusesCollection.doc(idCampus).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

async function listarCampuses({ apenasAtivos = false } = {}) {
  let query = campusesCollection;
  if (apenasAtivos) {
    query = query.where('ativo', '==', true);
  }
  const snapshot = await query.get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function atualizarCampus(idCampus, dados) {
  await campusesCollection.doc(idCampus).update(dados);
}

async function removerCampus(idCampus) {
  await campusesCollection.doc(idCampus).delete();
}

module.exports = {
  criarCampus,
  buscarCampusPorId,
  listarCampuses,
  atualizarCampus,
  removerCampus,
};