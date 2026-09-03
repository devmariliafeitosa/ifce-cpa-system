const express = require('express');
const router = express.Router();

const questionsController = require('../controllers/questionController');
const { exigirRole } = require('../middlewares/authMiddleware');

router.post('/', exigirRole('coordenador'), questionsController.criar);
router.put('/:id', exigirRole('coordenador'), questionsController.atualizar);
router.delete('/:id', exigirRole('coordenador'), questionsController.remover);

router.get('/:id', questionsController.buscarPorId);
router.get('/', questionsController.listar);

module.exports = router;