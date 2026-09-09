async function formatarRespostaResponse(resposta) {
  const answersFormatadas = await Promise.all(
    (resposta.answers || []).map(async (item) => ({
      questionId: item.question?.id || item.question,
      value: item.value,
    }))
  );

  return {
    id: resposta.id,
    formId: resposta.idForms?.id || resposta.idForms,
    userId: resposta.idUser?.id || resposta.idUser,
    answers: answersFormatadas,
    submittedAt: resposta.submittedAt,
  };
}

module.exports = { formatarRespostaResponse };