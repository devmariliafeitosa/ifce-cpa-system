const formsRepository = require('../repositories/formsRepository');
const { registrarLog } = require('./logsService');

const STATUS_VALIDOS = ['rascunho', 'publicado', 'encerrado'];

function validarForm({ title, campusId, startDate, endDate }) {
  if (!title) throw new Error('O título do formulário é obrigatório');
  if (!campusId) throw new Error('O campusId é obrigatório');
  if (!startDate || !endDate) throw new Error('Data de início e término são obrigatórias');
}

async function criarForm(dados, criadoPor) {
  validarForm(dados);

  const status = STATUS_VALIDOS.includes(dados.status) ? dados.status : 'rascunho';

  const formId = await formsRepository.criarForm({
    campusId: dados.campusId,
    createdBy: criadoPor,
    description: dados.description || '',
    endDate: dados.endDate,
    endTime: dados.endTime || '',
    isAtivo: dados.isAtivo ?? false,
    startDate: dados.startDate,
    startTime: dados.startTime || '',
    status,
    title: dados.title,
  });

  await registrarLog({
    userId: criadoPor,
    tipo: 'CREATE',
    descricao: `criou o formulário "${dados.title}"`,
  });

  return formId;
}

async function buscarForm(formId) {
  return formsRepository.buscarFormPorId(formId);
}

async function listarForms(filtros) {
  return formsRepository.listarForms(filtros);
}

async function atualizarForm(formId, dados, atualizadoPor) {
  const existente = await formsRepository.buscarFormPorId(formId);
  if (!existente) throw new Error(`Formulário "${formId}" não encontrado`);

  if (dados.status && !STATUS_VALIDOS.includes(dados.status)) {
    throw new Error(`Status inválido: ${dados.status}`);
  }

  await formsRepository.atualizarForm(formId, dados);

  await registrarLog({
    userId: atualizadoPor,
    tipo: 'UPDATE',
    descricao: `atualizou o formulário "${existente.title}"`,
  });
}

async function ativarForm(formId, atualizadoPor) {
  await formsRepository.atualizarForm(formId, { isAtivo: true, status: 'publicado' });

  await registrarLog({
    userId: atualizadoPor,
    tipo: 'UPDATE',
    descricao: `ativou o formulário "${formId}"`,
  });
}

async function encerrarForm(formId, atualizadoPor) {
  await formsRepository.atualizarForm(formId, { isAtivo: false, status: 'encerrado' });

  await registrarLog({
    userId: atualizadoPor,
    tipo: 'UPDATE',
    descricao: `encerrou o formulário "${formId}"`,
  });
}

async function deletarForm(formId, deletadoPor) {
  const existente = await formsRepository.buscarFormPorId(formId);
  if (!existente) throw new Error(`Formulário "${formId}" não encontrado`);

  await formsRepository.removerForm(formId);

  await registrarLog({
    userId: deletadoPor,
    tipo: 'DELETE',
    descricao: `deletou o formulário "${existente.title}"`,
  });
}

module.exports = {
  criarForm,
  buscarForm,
  listarForms,
  atualizarForm,
  ativarForm,
  encerrarForm,
  deletarForm, // Adicionado às exportações
};