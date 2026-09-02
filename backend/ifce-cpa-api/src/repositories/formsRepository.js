const { dbPrincipal } = require('../config/database');
const { FieldValue } = require('firebase-admin/firestore');

const formsCollection = dbPrincipal.collection('forms');

function formatarDoc(doc) {
  if (!doc.exists) return null;
  const data = doc.data();

  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
  };
}

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
  return formatarDoc(doc);
}

async function listarForms({ campusId = null, status = null, apenasAtivos = false } = {}) {
  let query = formsCollection;

  if (campusId) query = query.where('campusId', '==', campusId);
  if (status) query = query.where('status', '==', status);

  // Converte a string 'true' vinda de req.query em um booleano estrito para o Firestore
  const isAtivoBool = apenasAtivos === true || apenasAtivos == 'true';
  if (isAtivoBool) query = query.where('isAtivo', '==', true);

  const snapshot = await query.get();
  return snapshot.docs.map((doc) => formatarDoc(doc));
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