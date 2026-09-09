const formsServices = require('../services/formsService');
const { validarCriacaoForm, validarAtualizacaoForm } = require('../dto/formDto');
const { formatarFormResponse } = require('../models/formModel');

async function criar(req, res, next) {
  try {
    const dadosValidados = validarCriacaoForm(req.body);
    const formId = await formsServices.criarForm(dadosValidados, req.user.id);
    res.status(201).json({ id: formId });
  } catch (err) {
    next(err);
  }
}

async function buscarPorId(req, res, next) {
  try {
    const form = await formsServices.buscarForm(req.params.id);
    if (!form) {
      return res.status(404).json({ erro: true, mensagem: 'Formulário não encontrado' });
    }
    res.json(formatarFormResponse(form));
  } catch (err) {
    next(err);
  }
}

async function listar(req, res, next) {
  try {
    const { campusId, status, apenasAtivos } = req.query;
    const forms = await formsServices.listarForms({
      campusId,
      status,
      apenasAtivos: apenasAtivos === 'true',
    });
    res.json(forms.map(formatarFormResponse));
  } catch (err) {
    next(err);
  }
}

async function atualizar(req, res, next) {
  try {
    const dadosValidados = validarAtualizacaoForm(req.body);
    await formsServices.atualizarForm(req.params.id, dadosValidados, req.user.id);
    res.status(200).json({ mensagem: 'Formulário atualizado com sucesso' });
  } catch (err) {
    next(err);
  }
}

async function ativar(req, res, next) {
  try {
    await formsServices.ativarForm(req.params.id, req.user.id);
    res.status(200).json({ mensagem: 'Formulário ativado com sucesso' });
  } catch (err) {
    next(err);
  }
}

async function encerrar(req, res, next) {
  try {
    await formsServices.encerrarForm(req.params.id, req.user.id);
    res.status(200).json({ mensagem: 'Formulário encerrado com sucesso' });
  } catch (err) {
    next(err);
  }
}

module.exports = { criar, buscarPorId, listar, atualizar, ativar, encerrar };   