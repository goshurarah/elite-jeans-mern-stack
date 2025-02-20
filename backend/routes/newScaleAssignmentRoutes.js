const express = require('express');
const router = express.Router();
const newScaleAssignmentController = require('../controllers/newScaleAssignmentController');
router.post('/', newScaleAssignmentController.createNewScaleAssignment);
router.get('/', newScaleAssignmentController.getAllScaleAssignments);
router.get('/:id', newScaleAssignmentController.getScaleAssignmentById);
router.put('/:id', newScaleAssignmentController.updateScaleAssignment);
router.delete('/:id', newScaleAssignmentController.deleteScaleAssignment);
module.exports = router;