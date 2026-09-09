const express = require('express');

const {
  authenticate,
  exigirRole,
} = require('../middlewares/authMiddleware');

const router = express.Router();

router.get(
  '/me',
  authenticate,
  exigirRole('coordenador'),
  (req, res) => {
    return res.json({
      usuario: req.user,
    });
  }
);

module.exports = router;