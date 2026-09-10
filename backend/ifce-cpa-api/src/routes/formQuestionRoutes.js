const express = require('express');
const router = express.Router();

const formQuestionsController =
  require('../controllers/formQuestionsController');

const {
  authenticate,
  exigirRole,
} = require('../middlewares/authMiddleware');

router.post(
  '/',
  authenticate,
  exigirRole('coordenador'),
  formQuestionsController.vincular
);

router.delete(
  '/:id',
  authenticate,
  exigirRole('coordenador'),
  formQuestionsController.desvincular
);

router.get(
  '/form/:formId',
  formQuestionsController.listarPorForm
);

module.exports = router;