const formsService = require('../services/formsService');
const formQuestionsService = require('../services/formQuestionsServices');
const respostaFormsService = require('../services/respostaFormsServices');

const formsController = {
  async getAll(req, res) {
    try {
      const forms = await formsService.listarForms(req.query);
      return res.status(200).json({ data: forms, message: 'Formulários listados com sucesso' });
    } catch (error) {
      return res.status(500).json({ error: error.message || 'Erro ao listar formulários' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const form = await formsService.buscarForm(id);
      if (!form) return res.status(404).json({ error: 'Formulário não encontrado' });
      
      return res.status(200).json({ data: form, message: 'Formulário obtido com sucesso' });
    } catch (error) {
      return res.status(500).json({ error: error.message || 'Erro ao buscar formulário' });
    }
  },

  async create(req, res) {
    try {
      const userId = req.user?.id || req.body.createdBy; // Suporta middleware de auth ou body
      const formId = await formsService.criarForm(req.body, userId);
      return res.status(201).json({ data: { id: formId }, message: 'Formulário criado com sucesso' });
    } catch (error) {
      return res.status(400).json({ error: error.message || 'Erro ao criar formulário' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || req.body.updatedBy;
      await formsService.atualizarForm(id, req.body, userId);
      return res.status(200).json({ message: 'Formulário atualizado com sucesso' });
    } catch (error) {
      return res.status(400).json({ error: error.message || 'Erro ao atualizar formulário' });
    }
  },

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user?.id || req.body.updatedBy;

      if (status === 'publicado') await formsService.ativarForm(id, userId);
      else if (status === 'encerrado') await formsService.encerrarForm(id, userId);
      else await formsService.atualizarForm(id, { status }, userId);

      return res.status(200).json({ message: 'Status atualizado com sucesso' });
    } catch (error) {
      return res.status(400).json({ error: error.message || 'Erro ao alterar status' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || 'system';
      await formsService.deletarForm(id, userId);
      return res.status(200).json({ message: 'Formulário removido com sucesso' });
    } catch (error) {
      return res.status(500).json({ error: error.message || 'Erro ao deletar formulário' });
    }
  },

  async getQuestions(req, res) {
    try {
      const { id } = req.params;
      const questions = await formQuestionsService.getQuestionsByFormId(id);
      return res.status(200).json({ data: questions, message: 'Perguntas obtidas com sucesso' });
    } catch (error) {
      return res.status(500).json({ error: error.message || 'Erro ao buscar perguntas' });
    }
  },

  async getResponses(req, res) {
    try {
      const { id } = req.params;
      const responses = await respostaFormsService.getRespostasByFormId(id);
      return res.status(200).json({ data: responses, message: 'Respostas obtidas com sucesso' });
    } catch (error) {
      return res.status(500).json({ error: error.message || 'Erro ao buscar respostas' });
    }
  }
};

module.exports = formsController;