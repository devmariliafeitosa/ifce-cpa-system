const questionsRepository = require('../repositories/questionsRepository');
const { registrarLog } = require('./logsService');

const AUDIENCES_VALIDAS = ['aluno', 'docente', 'servidor', 'coordenador'];
const TIPOS_VALIDOS = ['multipla_escolha', 'texto_livre', 'escala', 'sim_nao'];

const STUDENT_LEVELS_VALIDOS = [
  'todos',
  'tecnico',
  'graduacao',
  'mestrado',
  'pos_graduacao',
];

function validarQuestion({ title, audiences, type, options, studentLevel }) {
  if (!title) {
    throw new Error('O título da pergunta é obrigatório');
  }

  if (!Array.isArray(audiences) || audiences.length === 0) {
    throw new Error('A pergunta precisa ter ao menos um público-alvo (audience)');
  }

  const audienceInvalida = audiences.find((a) => !AUDIENCES_VALIDAS.includes(a));
  if (audienceInvalida) {
    throw new Error(`Público-alvo inválido: ${audienceInvalida}`);
  }

  if (!TIPOS_VALIDOS.includes(type)) {
    throw new Error(`Tipo de pergunta inválido: ${type}`);
  }

  if (type === 'multipla_escolha' && (!Array.isArray(options) || options.length < 2)) {
    throw new Error('Perguntas de múltipla escolha precisam de ao menos 2 opções');
  }

  if (studentLevel !== undefined && !STUDENT_LEVELS_VALIDOS.includes(studentLevel)) {
    throw new Error(`Nível de discente inválido: ${studentLevel}`);
  }
}

async function criarQuestion(dados, criadoPor) {
  validarQuestion(dados);

  const questionId = await questionsRepository.criarQuestion({
    audiences: dados.audiences,
    options: dados.options || [],
    order: dados.order ?? 0,
    required: dados.required ?? false,
    title: dados.title,
    type: dados.type,
    studentLevel: dados.studentLevel ?? 'todos',
  });

  await registrarLog({
    userId: criadoPor,
    tipo: 'CREATE',
    descricao: `criou a questão "${dados.title}"`,
  });

  return questionId;
}

async function buscarQuestion(questionId) {
  return questionsRepository.buscarQuestionPorId(questionId);
}

async function listarQuestions(filtros) {
  return questionsRepository.listarQuestions(filtros);
}

async function atualizarQuestion(questionId, dados, atualizadoPor) {
  const existente = await questionsRepository.buscarQuestionPorId(questionId);
  if (!existente) throw new Error(`Questão "${questionId}" não encontrada`);

  await questionsRepository.atualizarQuestion(questionId, dados);

  await registrarLog({
    userId: atualizadoPor,
    tipo: 'UPDATE',
    descricao: `atualizou a questão "${existente.title}"`,
  });
}

async function removerQuestion(questionId, removidoPor) {
  const existente = await questionsRepository.buscarQuestionPorId(questionId);
  if (!existente) throw new Error(`Questão "${questionId}" não encontrada`);

  await questionsRepository.removerQuestion(questionId);

  await registrarLog({
    userId: removidoPor,
    tipo: 'DELETE',
    descricao: `removeu a questão "${existente.title}"`,
  });
}

module.exports = {
  criarQuestion,
  buscarQuestion,
  listarQuestions,
  atualizarQuestion,
  removerQuestion,
  STUDENT_LEVELS_VALIDOS,
};