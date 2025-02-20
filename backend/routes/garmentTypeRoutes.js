const express = require('express');
const {
    getAllGarmentTypes,
    getGarmentTypeById,
    createGarmentType,
    updateGarmentType,
    deleteGarmentType
} = require('../controllers/garmentTypeController');
const router = express.Router();
// Routes
router.get('/', getAllGarmentTypes);
router.get('/:id', getGarmentTypeById);
router.post('/', createGarmentType);
router.put('/:id', updateGarmentType);
router.delete('/:id', deleteGarmentType);
module.exports = router;