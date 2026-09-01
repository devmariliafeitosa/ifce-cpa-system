const { dbPrincipal } = require('../config/database');
const { FieldValue } = require('firebase-admin/firestore');

const formQuestionsCollection = dbPrincipal.collection('formQuestions');

async function criarRelacao(formId, questionId) {
  const docRef = formQuestionsCollection.doc();
  await docRef.set({
    idForm: dbPrincipal.collection('forms').doc(formId),
    idQuestion: dbPrincipal.collection('questions').doc(questionId),
    createdAt: FieldValue.serverTimestamp(),
  });
  return docRef.id;
}

async function buscarQuestionsPorForm(formId) {
  const formRef = dbPrincipal.collection('forms').doc(formId);

  const snapshot = await formQuestionsCollection
    .where('idForm', '==', formRef)
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