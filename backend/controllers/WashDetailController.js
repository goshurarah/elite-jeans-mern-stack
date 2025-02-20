const WashDetail = require("../models/washDetailModel");
const { uploadToS3, deleteFromS3 } = require("../utils/s3Client");

exports.createWashDetail = async (req, res) => {
  try {
    
    const washPicture = await uploadToS3(req.file);
    const { wash, dryProcess, color, comments, dynamicAttributes, techpack } = req.body;
    let parsedDynamicAttributes = {};
    if (dynamicAttributes) {
      try {
        parsedDynamicAttributes = JSON.parse(dynamicAttributes);
      } catch (error) {
        return res.status(400).json({ message: "Invalid dynamicAttributes format. Please provide a valid JSON object." });
      }
    }
    const newWashDetail = new WashDetail({
      wash,
      dryProcess,
      color,
      comments,
      washPicture,
      dynamicAttributes: parsedDynamicAttributes, 
      techpack, 
    });

    const savedWashDetail = await newWashDetail.save();
    res.status(201).json(savedWashDetail);
  } catch (error) {
    res.status(500).json({ message: "Error creating WashDetail", error: error.message });
  }
};

exports.getAllWashDetails = async (req, res) => {
  try {
    
    const washDetails = await WashDetail.find().populate('techpack');
    res.status(200).json(washDetails);
  } catch (error) {
    res.status(500).json({ message: "Error fetching WashDetails", error: error.message });
  }
};

exports.getWashDetailById = async (req, res) => {
  const { id } = req.params;
  try {
    
    const washDetail = await WashDetail.findById(id).populate('techpack');
    if (!washDetail) {
      return res.status(404).json({ message: "WashDetail not found!" });
    }
    res.status(200).json(washDetail);
  } catch (error) {
    res.status(500).json({ message: "Error fetching WashDetail", error: error.message });
  }
};



exports.updateWashDetail = async (req, res) => {
  const { id } = req.params; // Extract the ID from the request parameters

  try {
    // Check if the ID is provided
    if (!id) {
      return res.status(400).json({ message: "ID parameter is required." });
    }

    const updateData = req.body; // Extract the update data from the request body

    // Check if update data is valid
    if (!updateData || typeof updateData !== "object") {
      return res.status(400).json({ message: "Invalid update data provided." });
    }

    // If a file is included in the request, upload it to S3 and update washPicture
    if (req.file) {
      const washPicture = await uploadToS3(req.file);
      updateData.washPicture = washPicture;
    }

    // Perform the update operation
    const updatedWashDetail = await WashDetail.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } // Ensure updated data is validated
    );

    // If no document is found with the provided ID, return a 404 error
    if (!updatedWashDetail) {
      return res.status(404).json({ message: "WashDetail not found!" });
    }

    // Respond with the updated WashDetail
    res.status(200).json(updatedWashDetail);
  } catch (error) {
    // Log the error and respond with a 500 error status
    console.error("Error updating WashDetail:", error);
    res.status(500).json({ message: "Error updating WashDetail", error: error.message });
  }
};


exports.deleteWashDetail = async (req, res) => {
  const { id } = req.params;
  try {
   
    const washDetail = await WashDetail.findById(id);
    if (!washDetail) {
      return res.status(404).json({ message: "WashDetail not found!" });
    }

   
    if (washDetail.washPicture) {
      const key = washDetail.washPicture.split("/").pop();
      await deleteFromS3(key);
    }


    await washDetail.remove();
    res.status(200).json({ message: "WashDetail deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting WashDetail", error: error.message });
  }
};
