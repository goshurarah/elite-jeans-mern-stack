const SizeBreak = require('../models/sizeBreakModel');

exports.getAllSizeBreaks = async (req, res) => {
  try {
    const sizeBreaks = await SizeBreak.find();
    res.status(200).json(sizeBreaks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createSizeBreak = async (req, res) => {
  const sizeBreak = new SizeBreak({
    name: req.body.name,
  });

  try {
    const savedSizeBreak = await sizeBreak.save();
    res.status(201).json(savedSizeBreak);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteSizeBreak = async (req, res) => {
  try {
    const deletedSizeBreak = await SizeBreak.findByIdAndDelete(req.params.id);
    if (!deletedSizeBreak) {
      return res.status(404).json({ message: "SizeBreak not found" });
    }
    res.status(200).json({ message: "SizeBreak deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSizeBreak = async (req, res) => {
  try {
    const updatedSizeBreak = await SizeBreak.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSizeBreak) {
      return res.status(404).json({ message: "SizeBreak not found" });
    }
    res.status(200).json(updatedSizeBreak);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
