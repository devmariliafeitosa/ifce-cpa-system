const formQuestionsServices = require('../services/formQuestionsServices');
const { validarCriacaoRelacao } = require('../dto/formQuestionDto');
const { formatarRelacaoResponse } = require('../models/formQuestionModel');

async function vincular(req, res, next) {
  try {
    const { formId, questionId } = validarCriacaoRelacao(req.body);
    const idRelation = await formQuestionsServices.vincularQuestion(formId, questionId, req.user.id);
    res.status(201).json({ id: idRelation });
  } catch (err) {
    next(err);
  }
}

async function listarPorForm(req, res, next) {
  try {
    const questions = await formQuestionsServices.buscarQuestionsDoForm(req.params.formId);
    res.json(questions);
  } catch (err) {
    next(err);
  }
}

async function desvincular(req, res, next) {
  try {
    await formQuestionsServices.desvincularQuestion(req.params.id, req.user.id);
    res.status(200).json({ mensagem: 'Vínculo removido com sucesso' });
  } catch (err) {
    next(err);
  }
}

module.exports = { vincular, listarPorForm, desvincular };