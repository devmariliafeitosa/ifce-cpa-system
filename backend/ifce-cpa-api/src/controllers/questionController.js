const questionsServices = require('../services/questionsService');
const { validarCriacaoQuestion, validarAtualizacaoQuestion } = require('../dto/questionDTO');
const { formatarQuestionResponse } = require('../models/questionModel');

async function criar(req, res, next) {
  try {
    const dadosValidados = validarCriacaoQuestion(req.body);
    const questionId = await questionsServices.criarQuestion(dadosValidados, req.user.id);
    res.status(201).json({ id: questionId });
  } catch (err) {
    next(err);
  }
}

async function buscarPorId(req, res, next) {
  try {
    const question = await questionsServices.buscarQuestion(req.params.id);
    if (!question) {
      return res.status(404).json({ erro: true, mensagem: 'Questão não encontrada' });
    }
    res.json(formatarQuestionResponse(question));
  } catch (err) {
    next(err);
  }
}

async function listar(req, res, next) {
  try {
    const { audience } = req.query;
    const questions = await questionsServices.listarQuestions({ audience });
    res.json(questions.map(formatarQuestionResponse));
  } catch (err) {
    next(err);
  }
}

async function atualizar(req, res, next) {
  try {
    const dadosValidados = validarAtualizacaoQuestion(req.body);
    await questionsServices.atualizarQuestion(req.params.id, dadosValidados, req.user.id);
    res.status(200).json({ mensagem: 'Questão atualizada com sucesso' });
  } catch (err) {
    next(err);
  }
}

async function remover(req, res, next) {
  try {
    await questionsServices.removerQuestion(req.params.id, req.user.id);
    res.status(200).json({ mensagem: 'Questão removida com sucesso' });
  } catch (err) {
    next(err);
  }
}

module.exports = { criar, buscarPorId, listar, atualizar, remover };