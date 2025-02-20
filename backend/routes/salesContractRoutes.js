const express = require('express');
const router = express.Router();
const salesContractController = require('../controllers/salesContractController');

router.get('/', salesContractController.getAllSalesContracts);
router.post('/', salesContractController.createSalesContract);
router.delete('/:id', salesContractController.deleteSalesContract);
router.put('/:id', salesContractController.updateSalesContract);

module.exports = router;
