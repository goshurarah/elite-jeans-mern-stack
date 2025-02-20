const SampleRequest = require('../models/SampleRequest'); // Adjust the path as necessary

// Create a new Sample Request
exports.createSampleRequest = async (req, res) => {
  try {
    const sampleRequest = new SampleRequest(req.body);
    const savedSampleRequest = await sampleRequest.save();
    res.status(201).json(savedSampleRequest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all Sample Requests  
exports.getAllSampleRequests = async (req, res) => {
  try {
    // Extract techpackId from the request body
    const { techpackId } = req.body;

    // If techpackId is provided, filter sample requests by techpackId
    const filter = techpackId ? { techpackId } : {};

    // Fetch the sample requests based on the filter (techpackId or all)
    const sampleRequests = await SampleRequest.find(filter).populate('techpackId');
    
    // Send the response with the sample requests
    res.status(200).json(sampleRequests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get a specific Sample Request by ID
exports.getSampleRequestById = async (req, res) => {
  try {
    const sampleRequest = await SampleRequest.findById(req.params.id).populate('techpackId');
    if (!sampleRequest) {
      return res.status(404).json({ error: 'SampleRequest not found' });
    }
    res.status(200).json(sampleRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a Sample Request
exports.updateSampleRequest = async (req, res) => {
  try {
    const updatedSampleRequest = await SampleRequest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('techpackId');
    if (!updatedSampleRequest) {
      return res.status(404).json({ error: 'SampleRequest not found' });
    }
    res.status(200).json(updatedSampleRequest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a Sample Request
exports.deleteSampleRequest = async (req, res) => {
  try {
    const deletedSampleRequest = await SampleRequest.findByIdAndDelete(req.params.id);
    if (!deletedSampleRequest) {
      return res.status(404).json({ error: 'SampleRequest not found' });
    }
    res.status(200).json({ message: 'SampleRequest deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.addActionToSampleRequest = async (req, res) => {
  try {
    const sampleRequest = await SampleRequest.findById(req.params.id);
    if (!sampleRequest) {
      return res.status(404).json({ error: 'SampleRequest not found' });
    }

    // Add the new action
    sampleRequest.actions.push(req.body);

    // Save to trigger middleware
    await sampleRequest.save();

    res.status(200).json(sampleRequest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
