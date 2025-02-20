const express = require('express');
const router = express.Router();
const sampleRequestController = require('../controllers/SampleRequestController'); 


router.post('/', sampleRequestController.createSampleRequest);
router.get('/', sampleRequestController.getAllSampleRequests);
router.get('/:id', sampleRequestController.getSampleRequestById);
router.put('/:id', sampleRequestController.updateSampleRequest);
router.delete('/:id', sampleRequestController.deleteSampleRequest);
router.post('/:id/actions', sampleRequestController.addActionToSampleRequest);

module.exports = router;
