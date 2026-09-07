const express = require('express');
const router = express.Router();

const questionsController = require('../controllers/questionController');
const { authenticate, exigirRole} = require('../middlewares/authMiddleware');

router.post('/', authenticate, exigirRole('coordenador'), questionsController.criar);
router.put('/:id', authenticate, exigirRole('coordenador'), questionsController.atualizar);
router.delete('/:id', authenticate, exigirRole('coordenador'), questionsController.remover);

router.get('/:id', questionsController.buscarPorId);
router.get('/', questionsController.listar);

module.exports = router;