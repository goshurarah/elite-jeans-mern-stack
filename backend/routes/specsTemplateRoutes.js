const express = require('express');
const router = express.Router();
const specsTemplateController = require('../controllers/specsTemplateController');

// Routes
router.get('/', specsTemplateController.getAllSpecsTemplates);
router.get('/:id', specsTemplateController.getSpecsTemplateById);
router.post('/', specsTemplateController.createSpecsTemplate);
router.put('/:id', specsTemplateController.updateSpecsTemplate);
router.delete('/:id', specsTemplateController.deleteSpecsTemplate);

module.exports = router;