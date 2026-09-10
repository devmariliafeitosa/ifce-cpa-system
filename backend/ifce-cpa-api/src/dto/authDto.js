function validarLogin(body) {
  const { email, senha } = body;
  const erros = [];

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    erros.push('email é obrigatório e deve ser válido');
  }
  if (!senha || typeof senha !== 'string' || senha.length < 6) {
    erros.push('senha é obrigatória (mínimo 6 caracteres)');
  }

  if (erros.length > 0) {
    const erro = new Error(erros.join('; '));
    erro.status = 400;
    throw erro;
  }

  return { email, senha };
}

module.exports = { validarLogin };