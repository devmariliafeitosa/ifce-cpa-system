function formatarLoginResponse({ firebaseUid, usuario }) {
  return {
    id: usuario.id,
    firebaseUid,
    nome: usuario.nome,
    email: usuario.email,
    campusId: usuario.campusId?.id || usuario.campusId,
    roles: usuario.roles,
    ativo: usuario.ativo,
    dadosRoles: usuario.dadosRoles,
  };
}

module.exports = { formatarLoginResponse };