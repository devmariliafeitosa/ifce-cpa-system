const express = require('express');
const router = express.Router();

const formQuestionsController = require('../controllers/formQuestionsController');
const { exigirRole } = require('../middlewares/authMiddleware');

router.post('/', exigirRole('coordenador'), formQuestionsController.vincular);
router.delete('/:id', exigirRole('coordenador'), formQuestionsController.desvincular);

router.get('/form/:formId', formQuestionsController.listarPorForm);

module.exports = router;