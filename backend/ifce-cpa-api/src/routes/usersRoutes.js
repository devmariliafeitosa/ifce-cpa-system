const express = require('express');
const router = express.Router();
const { authenticate, exigirRole } = require('../middlewares/authMiddleware');
const usersController = require('../controllers/usersController');

router.post('/', authenticate, exigirRole('coordenador'), usersController.criar);

router.get('/:id', usersController.buscarPorId);

module.exports = router;