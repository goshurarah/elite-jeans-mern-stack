const { uploadToS3, deleteFromS3 } = require("../utils/s3Client");
const { PictureModel } = require("../models/pictureModel");

// Upload Image to S3 and Save to Database
const uploadImage = async (req, res) => {
  try {
    const { imageName, imageTitle, category } = req.body;

    if (!imageName || !imageTitle || !category) {
      return res.status(400).json({ message: "imageName, imageTitle, and category are required" });
    }

    const image = await uploadToS3(req.file, category);
    const newPicture = new PictureModel({
      imageName,
      imageTitle,
      category,
      imageUrl: image,
      active: true,
    });

    await newPicture.save();

    res.status(200).json({
      message: "Image uploaded successfully",
      data: newPicture,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      message: "Error uploading image.",
    });
  }
};

// Get All Pictures
const getAllPictures = async (req, res) => {
  try {
    const pictures = await PictureModel.find();
    res.status(200).json(pictures);
  } catch (error) {
    res.status(500).json({ error: "Error fetching pictures", details: error.message });
  }
};

// Get Images by Query Parameters
const getImages = async (req, res) => {
  try {
    const { category, active } = req.query;

    const query = {};
    if (category) query.category = category;
    if (active !== undefined) query.active = active === "true";

    const pictures = await PictureModel.find(query);

    if (pictures.length === 0) {
      return res.status(404).json({ message: "No images found" });
    }

    res.status(200).json({
      message: "Images retrieved successfully",
      data: pictures,
    });
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({
      message: "Error fetching images.",
    });
  }
};

// Get Distinct Categories
const getCategories = async (req, res) => {
  try {
    const categories = await PictureModel.distinct("category");
    res.status(200).json({
      categories,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching categories",
    });
  }
};

const getImagesByCategory = async (req, res) => {
  try {
    let { category } = req.params;
    const { active } = req.query;
    
    // Remove any quotes around the category
    category = category.replace(/(^"|"$)/g, '').trim();

    // Set up the query object
    const query = { category };
    if (active) query.active = active === "true";

    // Fetch images with only the imageUrl field
    const pictures = await PictureModel.find(query).select('imageUrl');
    res.status(200).json({
      picture: pictures,
    });
    if (pictures.length === 0) {
      return res.status(404).json({
        message: `No images found for category: ${category}`,
      });
    }

    // Return only the imageUrl values
    // const imageUrls = pictures.map(picture => picture.imageUrl);

    // res.status(200).json({
    //   pictures: imageUrls,
    // });
  } catch (error) {
    console.error("Error fetching images by category:", error);
    res.status(500).json({
      message: "Error fetching images",
    });
  }
};



// Delete Image from S3 and Database
const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    const picture = await PictureModel.findById(id);
    if (!picture) {
      return res.status(404).json({ message: "Picture not found" });
    }

    const imagePath = picture.imageUrl.replace(
      `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`,
      ""
    );

    await deleteFromS3(imagePath);
    await PictureModel.findByIdAndDelete(id);

    res.status(200).json({
      message: "Image deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while deleting image",
    });
  }
};

// Activate Image
const activateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const picture = await PictureModel.findByIdAndUpdate(
      id,
      { active: true },
      { new: true }
    );

    if (!picture) {
      return res.status(404).json({ message: "Picture not found" });
    }

    res.status(200).json({
      message: "Image activated",
      picture,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error activating image",
    });
  }
};

// Deactivate Image
const deactivateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const picture = await PictureModel.findByIdAndUpdate(
      id,
      { active: false },
      { new: true }
    );

    if (!picture) {
      return res.status(404).json({ message: "Picture not found" });
    }

    res.status(200).json({
      message: "Image deactivated",
      picture,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deactivating image",
    });
  }
};

// Update Image Details
const updateImage = async (req, res) => {
  try {
    const { id } = req.params; // Get the ID of the picture to update
    const { imageName, imageTitle, category, active } = req.body;

    // Log request body to ensure it's being received properly
    console.log("Request body received:", req.body);

    if (!id) {
      return res.status(400).json({ message: "Picture ID is required" });
    }

    // Fetch the current picture to check if the update is necessary
    const currentPicture = await PictureModel.findById(id);
    console.log("Current Picture before update:", currentPicture);

    // Prepare the update data
    const updateData = {};

    // Check and assign fields only if they're provided in the request
    if (typeof imageName !== "undefined" && imageName !== "") updateData.imageName = imageName;
    if (typeof imageTitle !== "undefined" && imageTitle !== "") updateData.imageTitle = imageTitle;
    if (typeof category !== "undefined" && category !== "") updateData.category = category;
    if (typeof active !== "undefined") updateData.active = active;

    // Log the data to update
    console.log("Update data:", updateData);

    // If no update data is provided, return an error
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "At least one of imageName, imageTitle, category, or active must be provided for update",
      });
    }

    // Perform the update operation
    const updatedPicture = await PictureModel.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      overwrite: true, // Force full update, even if fields are unchanged
    });

    // Log the updated document
    console.log("Updated Picture:", updatedPicture);

    // Handle case if picture isn't found or update didn't happen
    if (!updatedPicture) {
      return res.status(404).json({ message: "Picture not found or no changes made." });
    }

    res.status(200).json({
      message: "Picture updated successfully",
      data: updatedPicture,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      message: "Error updating picture.",
      details: error.message,
    });
  }
};


module.exports = {
  uploadImage,
  getCategories,
  getImagesByCategory,
  deleteImage,
  activateImage,
  deactivateImage,
  updateImage,
  getImages,
  getAllPictures,
};

