const { dbPrincipal } = require('../config/database');
const { FieldValue } = require('firebase-admin/firestore');

const formQuestionsCollection = dbPrincipal.collection('forms_questions_relation');

async function criarRelacao(formId, questionId) {
  const docRef = formQuestionsCollection.doc(); // gera id aleatório
  await docRef.set({
    idForms: dbPrincipal.collection('forms').doc(formId),
    idQuestion: dbPrincipal.collection('questions').doc(questionId),
    createdAt: FieldValue.serverTimestamp(),
  });
  return docRef.id;
}

async function buscarQuestionsPorForm(formId) {
  const formRef = dbPrincipal.collection('forms').doc(formId);

  const snapshot = await formQuestionsCollection
    .where('idForms', '==', formRef)
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function buscarFormsPorQuestion(questionId) {
  const questionRef = dbPrincipal.collection('questions').doc(questionId);

  const snapshot = await formQuestionsCollection
    .where('idQuestion', '==', questionRef)
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function removerRelacao(idRelation) {
  await formQuestionsCollection.doc(idRelation).delete();
}

module.exports = {
  criarRelacao,
  buscarQuestionsPorForm,
  buscarFormsPorQuestion,
  removerRelacao,
};