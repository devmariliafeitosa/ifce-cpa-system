const express = require('express');
const router = express.Router();

const respostaFormsController =
  require('../controllers/respostaFormController');

const { authenticate, exigirRole } = require('../middlewares/authMiddleware');

router.post('/public', respostaFormsController.enviarPublica);

router.post('/', authenticate, respostaFormsController.enviar);

router.get('/minhas', authenticate, respostaFormsController.listarMinhas);

router.get('/form/:formId', authenticate, exigirRole('coordenador'), respostaFormsController.listarPorForm);

router.get('/:id', authenticate, respostaFormsController.buscarPorId);

module.exports = router;