const express = require('express');
const router = express.Router();

const respostaFormsController = require('../controllers/respostaFormsController');
const { exigirRole } = require('../middlewares/authMiddleware');

router.post('/', respostaFormsController.enviar);

router.get('/minhas', respostaFormsController.listarMinhas);

router.get('/form/:formId', exigirRole('coordenador'), respostaFormsController.listarPorForm);

router.get('/:id', respostaFormsController.buscarPorId);

module.exports = router;