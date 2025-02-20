const Class = require("../models/ClassModel");
exports.createClass = async (req, res) => {
  try {
    const { name } = req.body;
    const existingClass = await Class.findOne({ name });
    if (existingClass) {
      return res
        .status(400)
        .json({ message: "Class with this name already exists" });
    }
    const newClass = new Class({ name });
    await newClass.save();
    res
      .status(201)
      .json({ message: "Class created successfully", data: newClass });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating class", error: error.message });
  }
};
// Get all classes
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find().sort({ createdAt: -1 }); // Sorting by creation date in descending order
    res.status(200).json(classes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching classes", error: error.message });
  }
};
// Get a class by ID
exports.getClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const classData = await Class.findById(id);
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.status(200).json(classData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching class by ID", error: error.message });
  }
};
// Update a class by ID
exports.updateClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedClass = await Class.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found" });
    }
    res
      .status(200)
      .json({ message: "Class updated successfully", data: updatedClass });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating class by ID", error: error.message });
  }
};
// Delete a class by ID
exports.deleteClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedClass = await Class.findByIdAndDelete(id);
    if (!deletedClass) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting class by ID", error: error.message });
  }
};
