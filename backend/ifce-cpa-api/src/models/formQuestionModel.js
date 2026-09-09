function formatarRelacaoResponse(relacao) {
  return {
    id: relacao.id,
    formId: relacao.idFoms?.id || relacao.idFoms,
    questionId: relacao.idQuestion?.id || relacao.idQuestion,
    createdAt: relacao.createdAt,
  };
}

module.exports = { formatarRelacaoResponse };