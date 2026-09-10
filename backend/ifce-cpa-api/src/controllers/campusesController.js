const campusesService = require('../services/campusesService');
const {
  validarCriacaoCampus,
  validarAtualizacaoCampus,
} = require('../dto/campusDto');
const { formatarCampusResponse } = require('../models/campusModel');

async function criar(req, res, next) {
  try {
    const dadosValidados = validarCriacaoCampus(req.body);

    const campusId = await campusesService.criarCampus(
      dadosValidados,
      req.user.id
    );

    const campus = await campusesService.buscarCampus(campusId);

    res.status(201).json(formatarCampusResponse(campus));
  } catch (err) {
    next(err);
  }
}

async function buscarPorId(req, res, next) {
  try {
    const campus = await campusesService.buscarCampus(req.params.id);

    if (!campus) {
      return res.status(404).json({
        erro: true,
        mensagem: 'Campus não encontrado',
      });
    }

    res.json(formatarCampusResponse(campus));
  } catch (err) {
    next(err);
  }
}

async function listar(req, res, next) {
  try {
    const { apenasAtivos } = req.query;

    const campuses = await campusesService.listarCampuses({
      apenasAtivos: apenasAtivos === 'true',
    });

    res.json(campuses.map(formatarCampusResponse));
  } catch (err) {
    next(err);
  }
}

async function atualizar(req, res, next) {
  try {
    const dadosValidados = validarAtualizacaoCampus(req.body);

    await campusesService.atualizarCampus(
      req.params.id,
      dadosValidados,
      req.user.id
    );

    const campus = await campusesService.buscarCampus(req.params.id);

    res.json(formatarCampusResponse(campus));
  } catch (err) {
    next(err);
  }
}

async function desativar(req, res, next) {
  try {
    await campusesService.desativarCampus(
      req.params.id,
      req.user.id
    );

    const campus = await campusesService.buscarCampus(req.params.id);

    res.json(formatarCampusResponse(campus));
  } catch (err) {
    next(err);
  }
}

module.exports = {
  criar,
  buscarPorId,
  listar,
  atualizar,
  desativar,
};