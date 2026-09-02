const express = require('express');
const router = express.Router();
const formsController = require('../controllers/formsController');

router.get('/', formsController.getAll);
router.post('/', formsController.create);
router.get('/:id', formsController.getById);
router.put('/:id', formsController.update);
router.patch('/:id/status', formsController.updateStatus); // Adicionada para trocar status rapidamente
router.delete('/:id', formsController.delete);

router.get('/:id/questions', formsController.getQuestions);
router.get('/:id/responses', formsController.getResponses);

module.exports = router;