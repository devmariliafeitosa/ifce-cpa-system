const express = require('express');
const router = express.Router();

const usersController = require('../controllers/usersController');
const { exigirRole } = require('../middlewares/authMiddleware');

router.post('/', exigirRole('coordenador'), usersController.criar);

router.get('/:id', usersController.buscarPorId);

module.exports = router;