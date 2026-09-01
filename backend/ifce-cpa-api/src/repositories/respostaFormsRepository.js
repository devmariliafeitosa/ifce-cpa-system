const { dbPrincipal } = require('../config/database');
const { FieldValue } = require('firebase-admin/firestore');

const respostaFormsCollection = dbPrincipal.collection('respostaForms');

async function criarResposta({ formId, userId, answers }) {
  const docRef = respostaFormsCollection.doc();

  await docRef.set({
    answers,
    idForms: dbPrincipal.collection('forms').doc(formId),
    idUser: dbPrincipal.collection('users').doc(userId),
    submittedAt: FieldValue.serverTimestamp(),
  });

  return docRef.id;
}

async function buscarRespostaPorId(idResponseForm) {
  const doc = await respostaFormsCollection.doc(idResponseForm).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

async function buscarRespostasPorForm(formId) {
  const formRef = dbPrincipal.collection('forms').doc(formId);

  const snapshot = await respostaFormsCollection
    .where('idForms', '==', formRef)
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function buscarRespostasPorUsuario(userId) {
  const userRef = dbPrincipal.collection('users').doc(userId);

  const snapshot = await respostaFormsCollection
    .where('idUser', '==', userRef)
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function jaRespondeu(formId, userId) {
  const formRef = dbPrincipal.collection('forms').doc(formId);
  const userRef = dbPrincipal.collection('users').doc(userId);

  const snapshot = await respostaFormsCollection
    .where('idForms', '==', formRef)
    .where('idUser', '==', userRef)
    .limit(1)
    .get();

  return !snapshot.empty;
}

module.exports = {
  criarResposta,
  buscarRespostaPorId,
  buscarRespostasPorForm,
  buscarRespostasPorUsuario,
  jaRespondeu,
};