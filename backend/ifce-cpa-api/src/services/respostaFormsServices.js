const respostaFormsRepository = require('../repositories/respostaFormsRepository');
const formsRepository = require('../repositories/formsRepository');
const { registrarLog } = require('./logsService');
const { dbPrincipal } = require('../config/database');

function validarAnswers(answers) {
  if (!Array.isArray(answers) || answers.length === 0) {
    throw new Error('É necessário enviar ao menos uma resposta');
  }

  answers.forEach((item, index) => {
    if (!item.question || item.value === undefined) {
      throw new Error(`Resposta inválida no índice ${index}: precisa de "question" e "value"`);
    }
  });
}

// Converte os ids de questão recebidos do frontend em references reais
function montarAnswersComReference(answers) {
  return answers.map(({ questionId, value }) => ({
    question: dbPrincipal.collection('questions').doc(questionId),
    value,
  }));
}

async function enviarResposta({ formId, userId, answers }) {
  const form = await formsRepository.buscarFormPorId(formId);
  if (!form) throw new Error(`Formulário "${formId}" não encontrado`);

  if (!form.isAtivo) {
    throw new Error('Este formulário não está mais aceitando respostas');
  }

  const jaRespondeu = await respostaFormsRepository.jaRespondeu(formId, userId);
  if (jaRespondeu) {
    throw new Error('Você já respondeu este formulário');
  }

  const answersComReference = montarAnswersComReference(answers);
  validarAnswers(answersComReference);

  const idResponseForm = await respostaFormsRepository.criarResposta({
    formId,
    userId,
    answers: answersComReference,
  });

  await registrarLog({
    userId,
    tipo: 'RESPONSE',
    descricao: `respondeu o formulário "${form.title}"`,
  });

  return idResponseForm;
}

async function buscarResposta(idResponseForm) {
  return respostaFormsRepository.buscarRespostaPorId(idResponseForm);
}

async function buscarRespostasDoForm(formId) {
  return respostaFormsRepository.buscarRespostasPorForm(formId);
}

async function buscarRespostasDoUsuario(userId) {
  return respostaFormsRepository.buscarRespostasPorUsuario(userId);
}

module.exports = {
  enviarResposta,
  buscarResposta,
  buscarRespostasDoForm,
  buscarRespostasDoUsuario,
};