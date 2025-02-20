const Color = require('../models/colorModel');

exports.getAllColors = async (req, res) => {
  try {
    const colors = await Color.find();
    res.status(200).json(colors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createColor = async (req, res) => {
  const color = new Color({
    name: req.body.name,
  });

  try {
    const savedColor = await color.save();
    res.status(201).json(savedColor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteColor = async (req, res) => {
  try {
    const deletedColor = await Color.findByIdAndDelete(req.params.id);
    if (!deletedColor) {
      return res.status(404).json({ message: "Color not found" });
    }
    res.status(200).json({ message: "Color deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateColor = async (req, res) => {
  try {
    const updatedColor = await Color.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedColor) {
      return res.status(404).json({ message: "Color not found" });
    }
    res.status(200).json(updatedColor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
