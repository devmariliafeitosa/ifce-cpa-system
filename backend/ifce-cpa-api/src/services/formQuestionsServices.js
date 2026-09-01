const formQuestionsRepository = require('../repositories/formQuestionsRepository');
const formsRepository = require('../repositories/formsRepository');
const questionsRepository = require('../repositories/questionsRepository');
const { registrarLog } = require('./logsServices');

async function vincularQuestion(formId, questionId, criadoPor) {
  const form = await formsRepository.buscarFormPorId(formId);
  if (!form) throw new Error(`Formulário "${formId}" não encontrado`);

  const question = await questionsRepository.buscarQuestionPorId(questionId);
  if (!question) throw new Error(`Questão "${questionId}" não encontrada`);

  const idRelation = await formQuestionsRepository.criarRelacao(formId, questionId);

  await registrarLog({
    userId: criadoPor,
    tipo: 'CREATE',
    descricao: `vinculou a questão "${question.title}" ao formulário "${form.title}"`,
  });

  return idRelation;
}

async function buscarQuestionsDoForm(formId) {
  const relacoes = await formQuestionsRepository.buscarQuestionsPorForm(formId);

  const questions = await Promise.all(
    relacoes.map(async (rel) => {
      const questionDoc = await rel.idQuestion.get();
      return { id: questionDoc.id, ...questionDoc.data(), idRelation: rel.id };
    })
  );

  return questions.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

async function desvincularQuestion(idRelation, removidoPor) {
  await formQuestionsRepository.removerRelacao(idRelation);

  await registrarLog({
    userId: removidoPor,
    tipo: 'DELETE',
    descricao: `removeu vínculo de questão (relation: ${idRelation})`,
  });
}

module.exports = {
  vincularQuestion,
  buscarQuestionsDoForm,
  desvincularQuestion,
};