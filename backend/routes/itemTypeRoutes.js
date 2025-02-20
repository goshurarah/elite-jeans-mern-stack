const express = require('express');
const router = express.Router();
const itemTypeController = require('../controllers/itemTypeController');

router.get('/', itemTypeController.getAllItemTypes);
router.post('/', itemTypeController.createItemType);
router.delete('/:id', itemTypeController.deleteItemType);
router.put('/:id', itemTypeController.updateItemType);

module.exports = router;
