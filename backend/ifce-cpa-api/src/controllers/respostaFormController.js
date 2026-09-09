const respostaFormsServices = require('../services/respostaFormsServices');
const { validarEnvioResposta } = require('../dto/respostaFormDto');
const { formatarRespostaResponse } = require('../models/respostaFormModel');

async function enviar(req, res, next) {
  try {
    const dadosValidados = validarEnvioResposta(req.body);
    const idResponseForm = await respostaFormsServices.enviarResposta({
      ...dadosValidados,
      userId: req.user.id, // vem do usuário autenticado, nunca do body
    });
    res.status(201).json({ id: idResponseForm });
  } catch (err) {
    next(err);
  }
}

async function buscarPorId(req, res, next) {
  try {
    const resposta = await respostaFormsServices.buscarResposta(req.params.id);
    if (!resposta) {
      return res.status(404).json({ erro: true, mensagem: 'Resposta não encontrada' });
    }
    res.json(await formatarRespostaResponse(resposta));
  } catch (err) {
    next(err);
  }
}

async function listarPorForm(req, res, next) {
  try {
    const respostas = await respostaFormsServices.buscarRespostasDoForm(req.params.formId);
    res.json(await Promise.all(respostas.map(formatarRespostaResponse)));
  } catch (err) {
    next(err);
  }
}

async function listarMinhas(req, res, next) {
  try {
    const respostas = await respostaFormsServices.buscarRespostasDoUsuario(req.user.id);
    res.json(await Promise.all(respostas.map(formatarRespostaResponse)));
  } catch (err) {
    next(err);
  }
}

module.exports = { enviar, buscarPorId, listarPorForm, listarMinhas };