const express = require('express');
const router = express.Router();
const subCategoryController = require('../controllers/subCategoryController');

router.get('/', subCategoryController.getAllSubCategories);
router.post('/', subCategoryController.createSubCategory);
router.delete('/:id', subCategoryController.deleteSubCategory);
router.put('/:id', subCategoryController.updateSubCategory);

module.exports = router;
