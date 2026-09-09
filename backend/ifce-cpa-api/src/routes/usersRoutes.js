const express = require('express');
const router = express.Router();
const { authenticate, exigirRole } = require('../middlewares/authMiddleware');
const usersController = require('../controllers/usersController');

router.post('/', exigirRole('coordenador'), usersController.criar);
router.get('/', exigirRole('coordenador'), usersController.listar);
router.put('/:id', exigirRole('coordenador'), usersController.atualizar);
router.patch('/:id/desativar', exigirRole('coordenador'), usersController.desativar);

router.get('/:id', usersController.buscarPorId);

module.exports = router;