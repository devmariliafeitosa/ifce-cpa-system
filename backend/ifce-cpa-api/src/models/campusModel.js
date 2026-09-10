function formatarCampusResponse(campus) {
  return {
    id: campus.id,
    nome: campus.nome,
    sigla: campus.sigla,
    ativo: campus.ativo,
  };
}

module.exports = { formatarCampusResponse };