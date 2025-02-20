const TechPack = require("../models/techPackModel");
const { validationResult } = require("express-validator");
let techPackCounter = 11159; // Initial counter for techPackId
const generateUniqueTechPackId = () => {
  techPackCounter += 1; // Increment counter for uniqueness
  return `TP-${techPackCounter}`;
};
exports.createTechPack = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      styleId,
      vendor,
      category,
      itemType,
      subCategory,
      labelTrim,
      pictures,
      buttonImages,
      rivetImages,
    } = req.body;
    if (!styleId || !vendor || !category || !itemType || !subCategory) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }
    // Generate a unique techPackId
    const techPackId = generateUniqueTechPackId();
    const newTechPack = new TechPack({
      techPackId,
      vendor,
      category,
      itemType,
      subCategory,
      labelTrim,
      pictures,
      rivetImages,
      buttonImages:
        buttonImages?.map((img) => ({
          ...img,
          color: img.color || "defaultColor",
          size: img.size || "defaultSize",
          quantity: img.quantity || 1,
          comment: img.comment || "",
        })) || [],
      rivetImages:
        rivetImages?.map((img) => ({
          ...img,
          color: img.color || "defaultColor",
          size: img.size || "defaultSize",
          quantity: img.quantity || 1,
          comment: img.comment || "",
        })) || [],
    });
    await newTechPack.save();
    res.status(201).json({
      message: "TechPack created successfully",
      data: newTechPack,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error",
      error: "An error occurred while creating the TechPack",
    });
  }
};
exports.getAllTechPacks = async (req, res) => {
  try {
    const techPacks = await TechPack.find().populate([
      { path: "vendor", select: "name" },
      { path: "category", select: "name" },
      { path: "itemType", select: "name" },
      { path: "subCategory", select: "name" },
      {
        path: "labelTrim",
        model: "TrimModel",
        select: "name description previewImage",
      },
      { path: "pictures", model: "Picture", select: "category imageUrl" },
      {
        path: "buttonImages",
        populate: {
          path: "image",
          model: "Picture",
          select: "url color size imageUrl",
        },
        select: "color size quantity comment",
      },
      // Populate rivetImages with image reference and its details
      {
        path: "rivetImages",
        populate: {
          path: "image",
          model: "Picture",
          select: "url color size imageUrl",
        },
        select: "color size quantity comment",
      },
    ]);
    // Check if data exists, if not return a message indicating no data found
    if (!techPacks || techPacks.length === 0) {
      return res.status(404).json({
        message: "No tech packs found",
        data: [],
      });
    }
    res.status(200).json({
      message: "TechPacks retrieved successfully",
      data: techPacks,
    });
  } catch (err) {
    console.error("Error fetching tech packs:", err);
    res.status(500).json({
      message: "Server Error",
      error: err.message || "An error occurred while retrieving TechPacks",
    });
  }
};
exports.getTechPackById = async (req, res) => {
  try {
    console.log("Fetching TechPack with ID:", req.params.id);
    const { id } = req.params;
    const techPack = await TechPack.findById(id)
      .populate("pictures")
      .populate({
        path: "buttonImages.image",
        model: "Picture",
      })
      .populate("vendor")
      .populate("category")
      .populate("itemType")
      .populate("subCategory")
      .populate("labelTrim")
      .populate({
        path: "rivetImages.image",
        model: "Picture",
      });
    if (!techPack) {
      return res.status(404).json({
        message: "TechPack not found",
        data: null,
      });
    }
    res.status(200).json({
      message: "TechPack retrieved successfully",
      data: techPack,
    });
  } catch (err) {
    console.error("Error fetching tech pack by ID:", err);
    res.status(500).json({
      message: "Server Error",
      error: err.message || "An error occurred while retrieving the TechPack",
    });
  }
};
exports.updateTechPack = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return res.status(400).json({
    //     message: 'Invalid ID format',
    //   });
    // }
    const techPack = await TechPack.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true } // `new: true` returns the updated document, `runValidators: true` ensures validation
    );
    res.status(200).json({
      message: "TechPack updated successfully",
      data: techPack,
    });
  } catch (err) {
    console.error("Error updating tech pack by ID:", err);
    res.status(500).json({
      message: "Server Error",
      error: err.message || "An error occurred while updating the TechPack",
    });
  }
};
const mongoose = require("mongoose");
exports.deleteTechPack = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid ID format",
      });
    }
    const deletedTechPack = await TechPack.findByIdAndDelete(id);
    if (!deletedTechPack) {
      return res.status(404).json({
        message: "TechPack not found",
      });
    }
    return res.status(200).json({
      message: "TechPack deleted successfully",
      data: deletedTechPack,
    });
  } catch (err) {
    console.error("Error deleting tech pack by ID:", err);
    return res.status(500).json({
      message: "Server Error",
      error: err.message || "An error occurred while deleting the TechPack",
    });
  }
};
