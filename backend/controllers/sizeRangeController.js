const SizeRange = require("../models/sizeRangeModel");
// Create a new range
const createRange = async (req, res) => {
  try {
    const { name, sizes, Pom_id } = req.body;
    if (!Pom_id) {
      return res
        .status(400)
        .json({ message: "Point of Measure (Pom_id) is required" });
    }
    const newRange = new SizeRange({ name, sizes, Pom_id });
    const result = await newRange.save();
    res
      .status(201)
      .json({ message: "Range created successfully", range: result });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create range", error: error.message });
  }
};
const getAllRanges = async (req, res) => {
  try {
    const ranges = await SizeRange.find().populate("Pom_id");
    res.status(200).json(ranges);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch ranges", error: error.message });
  }
};
const getRangeById = async (req, res) => {
  try {
    const { id } = req.params;
    const range = await SizeRange.findById(id).populate("Pom_id");
    if (!range) {
      return res.status(404).json({ message: "Range not found" });
    }
    res.status(200).json(range);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch range", error: error.message });
  }
};
const updateRangeById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sizes, Pom_id } = req.body;
    if (Pom_id && !mongoose.Types.ObjectId.isValid(Pom_id)) {
      return res
        .status(400)
        .json({ message: "Invalid Point of Measure (Pom_id)" });
    }
    const updatedRange = await SizeRange.findByIdAndUpdate(
      id,
      { name, sizes, Pom_id },
      { new: true, runValidators: true }
    );
    if (!updatedRange) {
      return res.status(404).json({ message: "Range not found" });
    }
    const populatedRange = await updatedRange.populate("Pom_id").execPopulate();
    res
      .status(200)
      .json({ message: "Range updated successfully", range: populatedRange });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update range", error: error.message });
  }
};
const deleteRangeById = async (req, res) => {
  try {
    const { id } = req.params;
    const rangeToDelete = await SizeRange.findById(id).populate("Pom_id");
    if (!rangeToDelete) {
      return res.status(404).json({ message: "Range not found" });
    }
    await SizeRange.findByIdAndDelete(id);
    res.status(200).json({
      message: "Range deleted successfully",
      range: rangeToDelete,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete range", error: error.message });
  }
};
const getAllNamesAndIds = async (req, res) => {
  try {
    // Fetch only name and _id
    const sizeRanges = await SizeRange.find({}, "name _id");
    res.status(200).json(sizeRanges);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch names and ids", error: error.message });
  }
};
module.exports = {
  createRange,
  getAllRanges,
  getRangeById,
  updateRangeById,
  deleteRangeById,
  getAllNamesAndIds,
};
