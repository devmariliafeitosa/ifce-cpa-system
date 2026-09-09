const express = require('express');
const router = express.Router();

const usersController = require('../controllers/usersController');
const { exigirRole } = require('../middlewares/authMiddleware');

router.post('/', exigirRole('coordenador'), usersController.criar);
router.get('/', exigirRole('coordenador'), usersController.listar);
router.put('/:id', exigirRole('coordenador'), usersController.atualizar);
router.patch('/:id/desativar', exigirRole('coordenador'), usersController.desativar);

router.get('/:id', usersController.buscarPorId);

module.exports = router;