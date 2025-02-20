const PointOfMeasure = require("../models/pointOfMeasureModel");

// Create a new Point of Measure
exports.createPointOfMeasure = async (req, res) => {
  try {
    const { code, description, tolerance } = req.body;

    if (!code || !description || !tolerance) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingPOM = await PointOfMeasure.findOne({ code });
    if (existingPOM) {
      return res.status(400).json({ message: "Code already exists." });
    }

    const newPOM = new PointOfMeasure({ code, description, tolerance });
    const savedPOM = await newPOM.save();

    res.status(201).json(savedPOM);
  } catch (error) {
    res.status(500).json({ message: "Error creating Point of Measure.", error: error.message });
  }
};



// Get all Points of Measure
exports.getAllPointsOfMeasure = async (req, res) => {
  try {
    const pointsOfMeasure = await PointOfMeasure.find();
    res.status(200).json(pointsOfMeasure);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Points of Measure.", error: error.message });
  }
};



// Get a Point of Measure by ID
exports.getPointOfMeasureById = async (req, res) => {
  try {
    const { id } = req.params;

    const pointOfMeasure = await PointOfMeasure.findById(id);
    if (!pointOfMeasure) {
      return res.status(404).json({ message: "Point of Measure not found." });
    }

    res.status(200).json(pointOfMeasure);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Point of Measure.", error: error.message });
  }
};



// Update a Point of Measure
exports.updatePointOfMeasure = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, description, tolerance } = req.body;

    const updatedPOM = await PointOfMeasure.findByIdAndUpdate(
      id,
      { code, description, tolerance },
      { new: true, runValidators: true }
    );

    if (!updatedPOM) {
      return res.status(404).json({ message: "Point of Measure not found." });
    }

    res.status(200).json(updatedPOM);
  } catch (error) {
    res.status(500).json({ message: "Error updating Point of Measure.", error: error.message });
  }
};


// Delete a Point of Measure
exports.deletePointOfMeasure = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPOM = await PointOfMeasure.findByIdAndDelete(id);
    if (!deletedPOM) {
      return res.status(404).json({ message: "Point of Measure not found." });
    }

    res.status(200).json({ message: "Point of Measure deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Point of Measure.", error: error.message });
  }
};



exports.filterPointOfMeasures = async (req, res) => {
    try {
      // Extract query parameters for filtering
      const { code, description, tolerance } = req.query;
  
      // Build the filter object dynamically based on provided query parameters
      const filter = {};
      if (code) filter.code = { $regex: code, $options: "i" }; // Case-insensitive search
      if (description) filter.description = { $regex: description, $options: "i" }; // Case-insensitive search
      if (tolerance) filter.tolerance = { $regex: tolerance, $options: "i" }; // Case-insensitive search
  
      // Query the database with the filter
      const filteredRecords = await PointOfMeasure.find(filter);
  
      // Respond with the filtered records
      res.status(200).json(filteredRecords);
    } catch (error) {
      res.status(500).json({ message: "Error filtering Point of Measures.", error: error.message });
    }
  };
  