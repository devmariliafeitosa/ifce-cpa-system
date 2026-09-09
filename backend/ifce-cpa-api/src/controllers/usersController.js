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

async function listar(req, res, next) {
  try {
    const usuarios = await usersServices.listarUsuarios();
    res.json(usuarios.map(formatarUsuarioResponse));
  } catch (err) {
    next(err);
  }
}

async function atualizar(req, res, next) {
  try {
    const dadosValidados = validarAtualizacaoUsuario(req.body);
    await usersServices.atualizarUsuario(req.params.id, dadosValidados, req.user.id);
    res.status(200).json({ mensagem: 'Usuário atualizado com sucesso' });
  } catch (err) {
    next(err);
  }
}

async function desativar(req, res, next) {
  try {
    await usersServices.desativarUsuario(req.params.id, req.user.id);
    res.status(200).json({ mensagem: 'Usuário desativado com sucesso' });
  } catch (err) {
    next(err);
  }
}

module.exports = { criar, buscarPorId, listar, atualizar, desativar };