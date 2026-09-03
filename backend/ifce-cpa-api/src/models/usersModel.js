function formatarUsuarioResponse(usuario) {
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    campusId: usuario.campusId?.id || usuario.campusId,
    roles: usuario.roles,
    ativo: usuario.ativo,
    dadosRoles: usuario.dadosRoles || undefined,
  };
}

module.exports = { formatarUsuarioResponse };