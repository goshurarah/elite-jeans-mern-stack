const express = require('express');
const router = express.Router();
const sizeBreakController = require('../controllers/sizeBreakController');

router.get('/', sizeBreakController.getAllSizeBreaks);
router.post('/', sizeBreakController.createSizeBreak);
router.delete('/:id', sizeBreakController.deleteSizeBreak);
router.put('/:id', sizeBreakController.updateSizeBreak);

module.exports = router;
