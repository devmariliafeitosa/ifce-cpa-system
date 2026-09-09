const { dbPrincipal } = require('../config/database');
const { FieldValue } = require('firebase-admin/firestore');

const formsCollection = dbPrincipal.collection('forms');

async function criarForm(dados) {
  const docRef = formsCollection.doc();
  await docRef.set({
    ...dados,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return docRef.id;
}

async function buscarFormPorId(formId) {
  const doc = await formsCollection.doc(formId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

async function listarForms({ campusId = null, status = null, apenasAtivos = false } = {}) {
  let query = formsCollection;

  if (campusId) query = query.where('campusId', '==', campusId);
  if (status) query = query.where('status', '==', status);
  if (apenasAtivos) query = query.where('isAtivo', '==', true);

  const snapshot = await query.get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function atualizarForm(formId, dados) {
  await formsCollection.doc(formId).update({
    ...dados,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

async function removerForm(formId) {
  await formsCollection.doc(formId).delete();
}

module.exports = {
  criarForm,
  buscarFormPorId,
  listarForms,
  atualizarForm,
  removerForm,
};