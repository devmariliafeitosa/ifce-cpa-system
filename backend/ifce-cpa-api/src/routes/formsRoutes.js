const express = require('express');
const router = express.Router();

const formsController = require('../controllers/formsController');
const { exigirRole } = require('../middlewares/authMiddleware');

router.post('/', exigirRole('coordenador'), formsController.criar);
router.put('/:id', exigirRole('coordenador'), formsController.atualizar);
router.patch('/:id/ativar', exigirRole('coordenador'), formsController.ativar);
router.patch('/:id/encerrar', exigirRole('coordenador'), formsController.encerrar);

router.get('/:id', formsController.buscarPorId);
router.get('/', formsController.listar);

module.exports = router;