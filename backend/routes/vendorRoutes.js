const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');

router.get('/', vendorController.getAllVendors);
router.post('/', vendorController.createVendor);
router.delete('/:id', vendorController.deleteVendor);
router.put('/:id', vendorController.updateVendor);

module.exports = router;
