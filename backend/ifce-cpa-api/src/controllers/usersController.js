const usersServices = require('../services/usersService');
const { validarCriacaoUsuario, validarAtualizacaoUsuario } = require('../dto/usersDto');
const { formatarUsuarioResponse } = require('../models/usersModel');

async function criar(req, res, next) {
  try {
    const dadosValidados = validarCriacaoUsuario(req.body);
    const userId = await usersServices.criarUsuario({
      ...dadosValidados,
      criadoPor: req.user.id,
    });
    res.status(201).json({ id: userId });
  } catch (err) {
    next(err);
  }
}

async function buscarPorId(req, res, next) {
  try {
    const usuario = await usersServices.buscarUsuarioCompleto(req.params.id);
    if (!usuario) {
      return res.status(404).json({ erro: true, mensagem: 'Usuário não encontrado' });
    }
    res.json(formatarUsuarioResponse(usuario));
  } catch (err) {
    next(err);
  }
}

module.exports = { criar, buscarPorId };