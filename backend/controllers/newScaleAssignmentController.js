const NewScaleAssignment = require('../models/newSizeScaleAssignmentModel');
exports.createNewScaleAssignment = async (req, res) => {
  try {
    const data = req.body;
    console.log(data,"body check data")
    const newScaleAssignment = new NewScaleAssignment(data);
    await newScaleAssignment.save();
    res.status(201).json(newScaleAssignment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating new scale assignment', error: error.message });
  }
};
exports.getAllScaleAssignments = async (req, res) => {
  try {
    console.log(req)
    const assignments = await NewScaleAssignment.find()
      .populate('client')
      .populate('itemType')
      .populate('category')
      .populate('class')
      .populate('sizeScale')
      .populate('sizeBreak');
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching scale assignments', error: error.message });
  }
};
exports.getScaleAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await NewScaleAssignment.findById(id)
      .populate('client')
      .populate('itemType')
      .populate('category')
      .populate('class')
      .populate('sizeScale')
      .populate('sizeBreak');
    if (!assignment) {
      return res.status(404).json({ message: 'Scale assignment not found' });
    }
    res.status(200).json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching scale assignment', error: error.message });
  }
};
exports.updateScaleAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const assignment = await NewScaleAssignment.findByIdAndUpdate(id, updatedData, { new: true });
    if (!assignment) {
      return res.status(404).json({ message: 'Scale assignment not found' });
    }
    res.status(200).json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating scale assignment', error: error.message });
  }
};
exports.deleteScaleAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await NewScaleAssignment.findByIdAndDelete(id);
    if (!assignment) {
      return res.status(404).json({ message: 'Scale assignment not found' });
    }
    res.status(200).json({ message: 'Scale assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting scale assignment', error: error.message });
  }
};