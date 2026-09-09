const express = require('express');
const router = express.Router();

const formsController = require('../controllers/formsController');
const { authenticate, exigirRole } = require('../middlewares/authMiddleware');

router.post('/', authenticate, exigirRole('coordenador'), formsController.criar);
router.put('/:id', authenticate, exigirRole('coordenador'), formsController.atualizar);
router.patch('/:id/ativar', authenticate, exigirRole('coordenador'), formsController.ativar);
router.patch('/:id/encerrar', authenticate, exigirRole('coordenador'), formsController.encerrar);
router.delete('/:id', authenticate, exigirRole('coordenador'), formsController.remover);

router.get('/:id', formsController.buscarPorId);
router.get('/', formsController.listar);

module.exports = router;