const express = require('express');
const router = express.Router();

const campusesController = require('../controllers/campusesController');
const { authenticate, exigirRole } = require('../middlewares/authMiddleware');

router.post('/', authenticate, exigirRole('coordenador'), campusesController.criar);
router.put('/:id', authenticate, exigirRole('coordenador'), campusesController.atualizar);
router.patch('/:id/desativar', authenticate, exigirRole('coordenador'), campusesController.desativar);

router.get('/', authenticate, campusesController.listar);
router.get('/:id', authenticate, campusesController.buscarPorId);

module.exports = router;