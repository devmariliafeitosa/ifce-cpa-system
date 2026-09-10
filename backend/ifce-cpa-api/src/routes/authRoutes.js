const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/authMiddleware');

router.post('/login', authController.login);

router.get('/me', authenticate, (req, res) => {
  res.json({ usuario: req.user });
});

module.exports = router;