const SizeScale = require('../models/sizeScaleModel');

exports.getAllSizeScales = async (req, res) => {
  try {
    const sizeScales = await SizeScale.find();
    res.status(200).json(sizeScales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createSizeScale = async (req, res) => {
  const sizeScale = new SizeScale({
    name: req.body.name,
  });

  try {
    const savedSizeScale = await sizeScale.save();
    res.status(201).json(savedSizeScale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteSizeScale = async (req, res) => {
  try {
    const deletedSizeScale = await SizeScale.findByIdAndDelete(req.params.id);
    if (!deletedSizeScale) {
      return res.status(404).json({ message: "SizeScale not found" });
    }
    res.status(200).json({ message: "SizeScale deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSizeScale = async (req, res) => {
  try {
    const updatedSizeScale = await SizeScale.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSizeScale) {
      return res.status(404).json({ message: "SizeScale not found" });
    }
    res.status(200).json(updatedSizeScale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
