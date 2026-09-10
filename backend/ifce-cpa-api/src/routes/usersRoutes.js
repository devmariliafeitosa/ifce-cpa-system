const express = require('express');
const router = express.Router();
const { authenticate, exigirRole } = require('../middlewares/authMiddleware');
const usersController = require('../controllers/usersController');

router.post('/', authenticate, exigirRole('coordenador'), usersController.criar);
router.get('/', authenticate, exigirRole('coordenador'), usersController.listar);
router.put('/:id', authenticate, exigirRole('coordenador'), usersController.atualizar);
router.patch('/:id/desativar', authenticate, exigirRole('coordenador'), usersController.desativar);

router.get('/:id', usersController.buscarPorId);

module.exports = router;