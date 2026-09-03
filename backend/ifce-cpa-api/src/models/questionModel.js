/**
 * @typedef {Object} Question
 * @property {string} id
 * @property {string} title
 * @property {string[]} audiences - 'aluno' | 'docente' | 'servidor' | 'coordenador'
 * @property {string} type - 'multipla_escolha' | 'texto_livre' | 'escala' | 'sim_nao'
 * @property {string[]} options
 * @property {number} order
 * @property {boolean} required
 * @property {FirebaseFirestore.Timestamp} createdAt
 */

function formatarQuestionResponse(question) {
  return {
    id: question.id,
    title: question.title,
    audiences: question.audiences,
    type: question.type,
    options: question.options || [],
    order: question.order ?? 0,
    required: question.required ?? false,
    createdAt: question.createdAt,
  };
}

module.exports = { formatarQuestionResponse };