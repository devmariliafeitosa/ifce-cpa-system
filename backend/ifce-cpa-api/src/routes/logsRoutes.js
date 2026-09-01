const express = require('express');

const controller = require('../controllers/logsController');

const { authenticate, requireAdmin, requireOwnerOrAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authenticate, controller.create);

router.get('/me', authenticate, (req, res, next) => {
  req.params.userId = req.user.uid || req.user.id || req.user.userId;
  return controller.getByUser(req, res, next);
});
router.get('/:userId', authenticate, requireOwnerOrAdmin, controller.getByUser);
router.get('/', authenticate, requireAdmin, controller.list);

module.exports = router;