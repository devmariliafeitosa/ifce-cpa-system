const { dbPrincipal } = require('../config/database');
const { FieldValue } = require('firebase-admin/firestore');

const questionsCollection = dbPrincipal.collection('questions');

async function criarQuestion(dados) {
  const docRef = questionsCollection.doc();
  await docRef.set({
    ...dados,
    studentLevel: dados.studentLevel ?? 'todos',
    createdAt: FieldValue.serverTimestamp(),
  });
  return docRef.id;
}

async function buscarQuestionPorId(questionId) {
  const doc = await questionsCollection.doc(questionId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

async function listarQuestions({ audience = null, studentLevel = null } = {}) {
  let query = questionsCollection.orderBy('order', 'asc');

  if (audience) {
    query = query.where('audiences', 'array-contains', audience);
  }

  if (studentLevel) {
    query = query.where('studentLevel', '==', studentLevel);
  }

  const snapshot = await query.get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function atualizarQuestion(questionId, dados) {
  await questionsCollection.doc(questionId).update(dados);
}

async function removerQuestion(questionId) {
  await questionsCollection.doc(questionId).delete();
}

module.exports = {
  criarQuestion,
  buscarQuestionPorId,
  listarQuestions,
  atualizarQuestion,
  removerQuestion,
};