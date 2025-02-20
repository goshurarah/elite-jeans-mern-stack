const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

router.get('/', clientController.getAllClients);
router.post('/', clientController.createClient);
router.delete('/:id', clientController.deleteClient);
router.put('/:id', clientController.updateClient);

module.exports = router;
