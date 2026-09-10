const authServices = require('../services/authService');
const { validarLogin } = require('../dto/authDto');
const { formatarLoginResponse } = require('../models/authModel');

async function login(req, res, next) {
  try {
    const { email, senha } = validarLogin(req.body);
    const resultado = await authServices.login(email, senha);

    return res.status(200).json({
      mensagem: 'Login realizado com sucesso!',
      token: resultado.idToken,
      usuario: formatarLoginResponse(resultado),
    });

  } catch (error) {
    if (error.message === 'ALUNO_NOT_FOUND') {
      return res.status(403).json({
        mensagem: 'Acesso negado: Este e-mail não pertence a um aluno cadastrado.',
      });
    }

    if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
      return res.status(401).json({
        mensagem: 'Credenciais inválidas. Verifique seu e-mail e senha.',
      });
    }

    if (error.status) {
      return res.status(error.status).json({
        mensagem: error.message,
      });
    }

    return res.status(500).json({
      mensagem: 'Erro interno no servidor ao tentar autenticar.',
      detalhes: error.message,
    });
  }
}

module.exports = { login };