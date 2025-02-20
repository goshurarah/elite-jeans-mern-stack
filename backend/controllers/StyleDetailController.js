const StyleDetail = require("../models/StyleDetail");
const { uploadToS3, deleteFromS3 } = require("../utils/s3Client");

exports.createStyleDetail = async (req, res) => {
  try {
    const {
      description,
      frontPocket,
      waistband,
      flyArea,
      stitchingThickness,
      inseam,
      zipper,
      fabric,
      backPocket,
      beltLoop,
      backYoke,
      sewingThreadColor,
      hem,
      summary,
      dynamicAttributes,
      techPackId,
    } = req.body;

    if (!description || !techPackId) {
      return res.status(400).json({ message: "Description and techPackId are required!" });
    }

    let samplePictureUrl = null;

   
    if (req.file) {
      samplePictureUrl = await uploadToS3(req.file);
    }

    
    let parsedDynamicAttributes = {};
    if (dynamicAttributes) {
      try {
        parsedDynamicAttributes = JSON.parse(dynamicAttributes);
      } catch (error) {
        return res.status(400).json({ message: "Invalid dynamicAttributes format. Please provide a valid JSON object." });
      }
    }

    
    const styleDetail = new StyleDetail({
      description,
      frontPocket,
      waistband,
      flyArea,
      stitchingThickness,
      inseam,
      zipper,
      samplePicture: samplePictureUrl,
      fabric,
      backPocket,
      beltLoop,
      backYoke,
      sewingThreadColor,
      hem,
      summary,
      dynamicAttributes: parsedDynamicAttributes, 
      techPackId,
    });

    const savedStyleDetail = await styleDetail.save();
    res.status(201).json(savedStyleDetail);
  } catch (error) {
    res.status(500).json({ message: "Error creating StyleDetail", error: error.message });
  }
};

exports.getAllStyleDetails = async (req, res) => {
  try {
    const { techPackId } = req.body;

    const styleDetails = await StyleDetail.find(techPackId).populate("techPackId");
    res.status(200).json(styleDetails);
  } catch (error) {
    res.status(500).json({ message: "Error fetching StyleDetails", error: error.message });
  }
};
exports.getAllSampleRequests = async (req, res) => {
  try {
    // Extract techpackId from the request body
    const { techpackId } = req.body;

    // If techpackId is provided, filter sample requests by techpackId
    const filter = techpackId ? { techpackId } : {};

    // Fetch the sample requests based on the filter (techpackId or all)
    const sampleRequests = await SampleRequest.find(filter).populate('techpackId');
    
    // Send the response with the sample requests
    res.status(200).json(sampleRequests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStyleDetailById = async (req, res) => {
  try {
    const styleDetail = await StyleDetail.findById(req.params.id).populate("techPackId");
    if (!styleDetail) {
      return res.status(404).json({ message: "StyleDetail not found!" });
    }
    res.status(200).json(styleDetail);
  } catch (error) {
    res.status(500).json({ message: "Error fetching StyleDetail", error: error.message });
  }
};

exports.updateStyleDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    
    if (req.file) {
      const existingStyleDetail = await StyleDetail.findById(id);
      if (existingStyleDetail && existingStyleDetail.samplePicture) {
        const existingKey = existingStyleDetail.samplePicture.split("/").pop();
        await deleteFromS3(existingKey);
      }
      const newPictureUrl = await uploadToS3(req.file);
      updateData.samplePicture = newPictureUrl;
    }

    
    if (updateData.dynamicAttributes) {
      try {
        updateData.dynamicAttributes = JSON.parse(updateData.dynamicAttributes);
      } catch (error) {
        return res.status(400).json({ message: "Invalid dynamicAttributes format." });
      }
    }

    const updatedStyleDetail = await StyleDetail.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedStyleDetail) {
      return res.status(404).json({ message: "StyleDetail not found!" });
    }

    res.status(200).json(updatedStyleDetail);
  } catch (error) {
    res.status(500).json({ message: "Error updating StyleDetail", error: error.message });
  }
};

exports.deleteStyleDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const styleDetail = await StyleDetail.findById(id);

    if (!styleDetail) {
      return res.status(404).json({ message: "StyleDetail not found!" });
    }

    if (styleDetail.samplePicture) {
      const key = styleDetail.samplePicture.split("/").pop();
      await deleteFromS3(key);
    }

    await styleDetail.remove();
    res.status(200).json({ message: "StyleDetail deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting StyleDetail", error: error.message });
  }
};
