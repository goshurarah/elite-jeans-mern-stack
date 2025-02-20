const workOrder = require("../models/workOrderModel");
const { uploadToS3, deleteFromS3 } = require("../utils/s3Client");
const { validationResult } = require("express-validator");
const SampleRequest = require("../models/SampleRequest");
const StyleDetail = require("../models/StyleDetail");
const WashDetail = require("../models/washDetailModel");
const NewDetail = require("../models/NewDetail");
const WashColor = require("../models/washNewColorModel");
const ItemDetail = require("../models/itemDetailMOdel");
const SampleGradedSpecs = require("../models/sampleGradedSpecsModel");
const DesignComments = require("../models/designCommentsModel");
const FitComments = require("../models/fitCommentsModel");
const sendWorkOrderEmail = require("../emails/workOrderEmail");
const SampleStatus = require("../models/sampleStatusModel");
const SampleRequestingStatus = require("../models/sampleRequestingStatus");
const PDFDocument = require("pdfkit");
const path = require("path");
const { generateWorkOrderPDF } = require("../services/workorder-pdf.service");
const TechPack = require("../models/techPackModel");

// Generate a unique workOrderId
const generateUniqueWorkOrderId = async () => {
  try {
    const lastWorkOrder = await workOrder
      .findOne({})
      .sort({ workOrderId: -1 })
      .exec();

    let newCounter = 1; // Default to 1 if no previous work order exists
    if (lastWorkOrder && lastWorkOrder.workOrderId) {
      const lastId = lastWorkOrder.workOrderId.split('-')[1]; // Extract the numeric part
      newCounter = parseInt(lastId, 10) + 1;
    }

    return `WO-${newCounter}`;
  } catch (error) {
    throw new Error("Error generating unique work order ID: " + error.message);
  }
};

// Generate a unique techPackId
const generateUniqueTechPackId = async () => {
  try {
    // Find the last tech pack sorted by `techPackId`
    const lastTechPack = await TechPack.findOne({}).sort({ techPackId: -1 }).exec();
    let newCounter = 1;

    if (lastTechPack && lastTechPack.techPackId) {
      const lastId = lastTechPack.techPackId.split("-")[1]; // Extract numeric part
      newCounter = parseInt(lastId, 10) + 1; // Increment
    }

    return `TP-${newCounter}`; // Format as TP-{number}
  } catch (error) {
    throw new Error("Error generating unique tech pack ID: " + error.message);
  }
};

exports.createWorkOrderInTechPack = async (req, res) => {
  try {
    const { workOrderId } = req.params;

    // Fetch the workOrder by ID
    const existingWorkOrder = await workOrder.findById(workOrderId).populate("vendor category itemType subCategory trim_id pictures");

    if (!existingWorkOrder) {
      return res.status(404).json({ message: "WorkOrder not found" });
    }

    // Generate a unique techPackId
    const techPackId = await generateUniqueTechPackId();

    // Create a new TechPack using the data from the WorkOrder
    const newTechPack = new TechPack({
      techPackId,
      styleId: existingWorkOrder.styleId || null,
      vendor: existingWorkOrder.vendor,
      category: existingWorkOrder.category,
      itemType: existingWorkOrder.itemType,
      subCategory: existingWorkOrder.subCategory,
      pictures: existingWorkOrder.pictures,
      buttonImages: existingWorkOrder.buttonImages,
      rivetImages: existingWorkOrder.rivetImages,
    });

    // Save the TechPack in the database
    await newTechPack.save();

    res.status(201).json({
      message: "TechPack created successfully",
      data: newTechPack,
    });
  } catch (error) {
    console.error("Error creating TechPack:", error.message);
    res.status(500).json({ message: "Error creating TechPack", error: error.message });
  }
};
exports.createRepeatWorkOrder = async (req, res) => {
  try {
    const { workOrderId } = req.params;

    // Fetch the workOrder by ID
    const existingWorkOrder = await workOrder.findById(workOrderId).populate("vendor category itemType subCategory trim_id pictures");

    if (!existingWorkOrder) {
      return res.status(404).json({ message: "WorkOrder not found" });
    }

    // Generate a unique WorkOrder ID (ensure this is resolved)
    const newWorkOrderId = await generateUniqueWorkOrderId();

    // Create a new WorkOrder with the same data but a new WorkOrderId
    const clonedWorkOrder = new workOrder({
      ...existingWorkOrder.toObject(),
      _id: undefined, // Remove the _id to allow MongoDB to generate a new one
      workOrderId: newWorkOrderId, // Assign the resolved unique ID
      createdAt: Date.now(), // Set the current timestamp for creation
    });

    // Save the cloned WorkOrder
    await clonedWorkOrder.save();

    res.status(201).json({
      message: 'WorkOrder cloned successfully',
      data: clonedWorkOrder,
    });
  } catch (error) {
    console.error('Error cloning WorkOrder:', error);
    res.status(500).json({ message: 'Error cloning WorkOrder', error: error.message });
  }
};
exports.createWorkOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { vendor, category, itemType, subCategory, etd } = req.body;

    if (!vendor || !category || !itemType || !subCategory) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }
    // Generate a unique workOrderId
    const workOrderId = await generateUniqueWorkOrderId();
    const newWorkOrder = new workOrder({
      workOrderId,
      vendor,
      category,
      itemType,
      subCategory,
      etd,
    });

    await newWorkOrder.save();

    res.status(201).json({
      message: "WorkOrder created successfully",
      data: newWorkOrder,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating WorkOrder", error: error.message });
  }
};

exports.getAllWorkOrder = async (req, res) => {
  try {
    // Extract page number from query parameters, default to 1
    const page = parseInt(req.query.page) || 1;
    const limit = 50; // Records per page

    // Calculate the starting index for the query
    const skip = (page - 1) * limit;

    // Get the total count of documents
    const totalRecords = await workOrder.countDocuments();

    // Fetch the work orders with pagination and populate
    const workOrders = await workOrder
      .find()
      .populate("vendor category itemType subCategory trim_id pictures")
      .skip(skip)
      .limit(limit);

    // Calculate total pages
    const totalPages = Math.ceil(totalRecords / limit);

    // Send the paginated response
    res.status(200).json({
      message: "WorkOrders fetched successfully",
      data: workOrders,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching WorkOrders", error: error.message });
  }
};

exports.getFilteredWorkOrders = async (req, res) => {
  try {
    // Extract query parameters for filtering and pagination
    const {
      vendor,
      category,
      itemType,
      subCategory,
      trim_id,
      etdFrom,
      etdTo,
      page = 1,
      limit = 50,
      Class,
      style,
      client,
      design_status,
      fit_status,
      shippping_status,
    } = req.query;

    // Build the filter object based on provided query parameters
    const filter = {};

    if (vendor) filter.vendor = vendor;
    if (category) filter.category = category;
    if (itemType) filter.itemType = itemType;
    if (subCategory) filter.subCategory = subCategory;
    if (trim_id) filter.trim_id = trim_id;

    // Add date range filtering for `etd` (Estimated Time of Delivery)
    if (etdFrom || etdTo) {
      filter.etd = {};
      if (etdFrom) filter.etd.$gte = new Date(etdFrom);
      if (etdTo) filter.etd.$lte = new Date(etdTo);
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Fetch filtered work orders with pagination
    const [workOrders, totalRecords] = await Promise.all([
      workOrder
        .find(filter)
        .populate("vendor category itemType subCategory trim_id pictures")
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }), // Sort by creation date
      workOrder.countDocuments(filter),
    ]);

    // Calculate total pages
    const totalPages = Math.ceil(totalRecords / limit);

    // Response with data and pagination metadata
    res.status(200).json({
      message: "Filtered WorkOrders fetched successfully",
      data: workOrders,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalRecords,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching WorkOrders", error: error.message });
  }
};

exports.getWorkOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const workOrderDetail = await workOrder
      .findById(id)
      .populate("vendor")
      .populate("category")
      .populate("itemType")
      .populate("subCategory")
      .populate("pictures")
      .populate("trim_id")
      .populate({
        path: "rivetImages.image",
        model: "Picture",
      })
      .populate("pictures")
      .populate({
        path: "buttonImages.image",
        model: "Picture",
      })
      .populate({
        path: "trimImages.image",
        model: "Picture",
      });
    if (!workOrderDetail) {
      return res.status(404).json({ message: "WorkOrder not found!" });
    }
    res.status(200).json(workOrderDetail);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching WorkOrder", error: error.message });
  }
};

exports.editWorkOrder = async (req, res) => {
  const { id } = req.params;

  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      vendor,
      category,
      itemType,
      subCategory,
      trim_id,
      etd,
      pictures,
      buttonImages,
      rivetImages,
      trimImages,
    } = req.body;

    // // Ensure required fields are present
    // if (!vendor || !category || !itemType || !subCategory || !trim_id) {
    //     return res.status(400).json({ message: 'All required fields must be provided' });
    // }

    // Prepare the update payload
    const updateData = {
      vendor,
      category,
      itemType,
      subCategory,
      trim_id,
      etd,
    };

    // Conditionally update pictures
    if (pictures) {
      updateData.pictures = pictures; // This should be an array of picture IDs
    }

    // Conditionally update buttonImages
    if (buttonImages) {
      updateData.buttonImages = buttonImages.map((button) => ({
        image: button.image, // Picture ID
        color: button.color,
        size: button.size,
        quantity: button.quantity,
        comment: button.comment,
      }));
    }

    // Conditionally update rivetImages
    if (rivetImages) {
      updateData.rivetImages = rivetImages.map((rivet) => ({
        image: rivet.image, // Picture ID
        color: rivet.color,
        size: rivet.size,
        quantity: rivet.quantity,
        comment: rivet.comment,
      }));
    }

    // Conditionally update trimImages
    if (trimImages) {
      updateData.trimImages = trimImages.map((trimImage) => ({
        image: trimImage.image, // Picture ID
        color: trimImage.color,
        size: trimImage.size,
        quantity: trimImage.quantity,
        comment: trimImage.comment,
      }));
    }

    // Find and update the WorkOrder
    const updatedWorkOrder = await workOrder.findByIdAndUpdate(
      id,
      updateData,
      { new: true } // Return the updated document
    );

    // If no workOrder found
    if (!updatedWorkOrder) {
      return res.status(404).json({ message: "WorkOrder not found!" });
    }

    res.status(200).json({
      message: "WorkOrder updated successfully",
      data: updatedWorkOrder,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating WorkOrder", error: error.message });
  }
};

exports.createSampleRequest = async (req, res) => {
  try {
    // Validate the request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      workOrder_Id,
      styleNumber,
      size,
      quantity,
      sampleType,
      dueDate,
      comments,
    } = req.body;

    // Ensure all required fields are provided
    if (
      !workOrder_Id ||
      !styleNumber ||
      !size ||
      !quantity ||
      !sampleType ||
      !dueDate
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    // Create a new SampleRequest
    const newSampleRequest = new SampleRequest({
      workOrder_Id,
      styleNumber,
      size,
      quantity,
      sampleType,
      dueDate,
      comments,
    });

    await newSampleRequest.save();

    res.status(201).json({
      message: "Sample Request created successfully",
      data: newSampleRequest,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating Sample Request", error: error.message });
  }
};

// Get all SampleRequests
exports.getAllSampleRequests = async (req, res) => {
  try {
    const sampleRequests = await SampleRequest.find()
      .populate("workOrder")
      .exec();

    res.status(200).json({
      message: "Sample Requests fetched successfully",
      data: sampleRequests,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching Sample Requests",
      error: error.message,
    });
  }
};
// Get all SampleRequests against workorder
exports.getAllSampleRequestsByWorkOrderID = async (req, res) => {
  try {
    const { id } = req.body; // Ensure `id` is extracted from `req.body`.

    // Validate `id` to ensure it's in the correct format (if needed).
    if (!id) {
      return res.status(400).json({
        message: "Invalid ID provided",
      });
    }

    // Query using an object. Assuming `id` is used to filter by `workOrder`.
    const sampleRequests = await SampleRequest.find({ workOrder_Id: id });

    res.status(200).json({
      message: "Sample Requests fetched successfully",
      data: sampleRequests,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching Sample Requests",
      error: error.message,
    });
  }
};

// Get SampleRequest by ID
exports.getSampleRequestById = async (req, res) => {
  const { id } = req.params;

  try {
    const sampleRequest = await SampleRequest.findById(id)
      .populate("techpackId workOrder_Id")
      .exec();

    if (!sampleRequest) {
      return res.status(404).json({ message: "Sample Request not found!" });
    }

    res.status(200).json({
      message: "Sample Request fetched successfully",
      data: sampleRequest,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Sample Request", error: error.message });
  }
};
exports.editSampleRequest = async (req, res) => {
  const { id } = req.params;

  try {
    // Validate the request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      styleNumber,
      size,
      quantity,
      sampleType,
      dueDate,
      comments,
      status,
    } = req.body;

    // Find the existing Sample Request by ID
    const sampleRequest = await SampleRequest.findById(id);
    if (!sampleRequest) {
      return res.status(404).json({ message: "Sample Request not found!" });
    }

    // Update fields if provided
    if (styleNumber) sampleRequest.styleNumber = styleNumber;
    if (size) sampleRequest.size = size;
    if (quantity) sampleRequest.quantity = quantity;
    if (sampleType) sampleRequest.sampleType = sampleType;
    if (dueDate) sampleRequest.dueDate = dueDate;
    if (comments) sampleRequest.comments = comments;
    if (status) sampleRequest.status = status;

    await sampleRequest.save();

    res.status(200).json({
      message: "Sample Request updated successfully",
      data: sampleRequest,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating Sample Request", error: error.message });
  }
};

exports.deleteSampleRequest = async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete the Sample Request
    const sampleRequest = await SampleRequest.findByIdAndDelete(id);

    if (!sampleRequest) {
      return res.status(404).json({ message: "Sample Request not found!" });
    }

    res.status(200).json({ message: "Sample Request deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting Sample Request", error: error.message });
  }
};

exports.createStyleDetail = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      description,
      frontPocket,
      waistband,
      flyArea,
      stitchingThickness,
      inseam,
      zipper,
      samplePicture,
      fabric,
      backPocket,
      beltLoop,
      backYoke,
      sewingThreadColor,
      hem,
      summary,
      dynamicAttributes,
      workOrder_Id,
    } = req.body;

    if (!description || !workOrder_Id) {
      return res
        .status(400)
        .json({ message: "Description and WorkOrder ID are required" });
    }
    let samplePictureUrl = null;


    if (req.file) {
      samplePictureUrl = await uploadToS3(req.file);
    }
    const newStyleDetail = new StyleDetail({
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
      dynamicAttributes,
      workOrder_Id,
    });

    await newStyleDetail.save();

    res.status(201).json({
      message: "Style Detail created successfully",
      data: newStyleDetail,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating Style Detail", error: error.message });
  }
};

// Get All Style Details
exports.getAllStyleDetails = async (req, res) => {
  try {
    const styleDetails = await StyleDetail.find().populate("workOrder_Id");
    res.status(200).json(styleDetails);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Style Details", error: error.message });
  }
};
exports.getAllStyleDetailsByWorkOrderID = async (req, res) => {
  try {
    const { workOrder_Id } = req.body;
    if (!workOrder_Id) {
      return res.status(400).json({
        message: "Invalid ID provided",
      });
    }
    const styleDetails = await StyleDetail.find({ workOrder_Id: workOrder_Id });
    res.status(200).json(styleDetails);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Style Details", error: error.message });
  }
};
// Get Style Detail By ID
exports.getStyleDetailById = async (req, res) => {
  const { id } = req.params;
  try {
    const styleDetail = await StyleDetail.findById(id).populate("workOrder_Id");
    if (!styleDetail) {
      return res.status(404).json({ message: "Style Detail not found!" });
    }
    res.status(200).json(styleDetail);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Style Detail", error: error.message });
  }
};

// Update Style Detail
exports.editStyleDetail = async (req, res) => {
  const { id } = req.params;
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      description,
      frontPocket,
      waistband,
      flyArea,
      stitchingThickness,
      inseam,
      zipper,
      samplePicture,
      fabric,
      backPocket,
      beltLoop,
      backYoke,
      sewingThreadColor,
      hem,
      summary,
      dynamicAttributes,
    } = req.body;

    const updateData = {
      ...(description && { description }),
      ...(frontPocket && { frontPocket }),
      ...(waistband && { waistband }),
      ...(flyArea && { flyArea }),
      ...(stitchingThickness && { stitchingThickness }),
      ...(inseam && { inseam }),
      ...(zipper && { zipper }),
      ...(samplePicture && { samplePicture }),
      ...(fabric && { fabric }),
      ...(backPocket && { backPocket }),
      ...(beltLoop && { beltLoop }),
      ...(backYoke && { backYoke }),
      ...(sewingThreadColor && { sewingThreadColor }),
      ...(hem && { hem }),
      ...(summary && { summary }),
      ...(dynamicAttributes && { dynamicAttributes }),
    };

    const updatedStyleDetail = await StyleDetail.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedStyleDetail) {
      return res.status(404).json({ message: "Style Detail not found!" });
    }

    res.status(200).json({
      message: "Style Detail updated successfully",
      data: updatedStyleDetail,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating Style Detail", error: error.message });
  }
};

// Delete Style Detail
exports.deleteStyleDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedStyleDetail = await StyleDetail.findByIdAndDelete(id);

    if (!deletedStyleDetail) {
      return res.status(404).json({ message: "Style Detail not found!" });
    }

    res.status(200).json({ message: "Style Detail deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting Style Detail", error: error.message });
  }
};

exports.createWashDetail = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      wash,
      dryProcess,
      color,
      comments,
      washPicture,
      dynamicAttributes,
      techpack,
      workOrder_Id,
    } = req.body;

    // Ensure required fields are provided
    if (!wash || !dryProcess || !color || !techpack || !workOrder_Id) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    // Create a new WashDetail
    const newWashDetail = new WashDetail({
      wash,
      dryProcess,
      color,
      comments,
      washPicture,
      dynamicAttributes,
      techpack,
      workOrder_Id,
    });

    await newWashDetail.save();

    res.status(201).json({
      message: "WashDetail created successfully.",
      data: newWashDetail,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating WashDetail", error: error.message });
  }
};

// Get All WashDetails
exports.getAllWashDetails = async (req, res) => {
  try {
    const washDetails = await WashDetail.find()
      .populate("techpack")
      .populate("workOrder_Id");
    res.status(200).json(washDetails);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching WashDetails", error: error.message });
  }
};

// Get All WashDetails against workorder
exports.getAllWashDetailsByWorkOrderID = async (req, res) => {
  try {
    const { workOrder_Id } = req.body;
    const washDetails = await WashDetail.find({ workOrder_Id: workOrder_Id })
    res.status(200).json(washDetails);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching WashDetails", error: error.message });
  }
};

// Get WashDetail by ID
exports.getWashDetailById = async (req, res) => {
  const { id } = req.params;
  try {
    const washDetail = await WashDetail.findById(id)
      .populate("techpack")
      .populate("workOrder_Id");
    if (!washDetail) {
      return res.status(404).json({ message: "WashDetail not found!" });
    }
    res.status(200).json(washDetail);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching WashDetail", error: error.message });
  }
};

// Update WashDetail
exports.editWashDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      wash,
      dryProcess,
      color,
      comments,
      washPicture,
      dynamicAttributes,
      techpack,
      workOrder_Id,
    } = req.body;

    // Find the WashDetail by ID
    const washDetail = await WashDetail.findById(id);
    if (!washDetail) {
      return res.status(404).json({ message: "WashDetail not found!" });
    }

    // Update fields if provided
    if (wash) washDetail.wash = wash;
    if (dryProcess) washDetail.dryProcess = dryProcess;
    if (color) washDetail.color = color;
    if (comments) washDetail.comments = comments;
    if (washPicture) washDetail.washPicture = washPicture;
    if (dynamicAttributes) washDetail.dynamicAttributes = dynamicAttributes;
    if (techpack) washDetail.techpack = techpack;
    if (workOrder_Id) washDetail.workOrder_Id = workOrder_Id;

    await washDetail.save();

    res.status(200).json({
      message: "WashDetail updated successfully.",
      data: washDetail,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating WashDetail", error: error.message });
  }
};

// Delete WashDetail
exports.deleteWashDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const washDetail = await WashDetail.findByIdAndDelete(id);

    if (!washDetail) {
      return res.status(404).json({ message: "WashDetail not found!" });
    }

    res.status(200).json({ message: "WashDetail deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting WashDetail", error: error.message });
  }
};

// Create a NewDetail
exports.createNewDetail = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      workOrder_Id,
      wash_detail_id,
      style_detail_id,
      detail_category,
      comment,
      pic,
      size,
    } = req.body;

    const newDetail = new NewDetail({
      workOrder_Id,
      wash_detail_id,
      style_detail_id,
      detail_category,
      comment,
      pic,
      size,
    });

    await newDetail.save();

    res.status(201).json({
      message: "NewDetail created successfully",
      data: newDetail,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating NewDetail", error: error.message });
  }
};

// Get a single NewDetail by ID
exports.getNewDetailById = async (req, res) => {
  try {
    const { id } = req.params;
    const newDetail = await NewDetail.findById(id)
      .populate("workOrder_Id")
      .populate("pic")
      .populate("style_detail_id");

    if (!newDetail) {
      return res.status(404).json({ message: "NewDetail not found" });
    }

    res.status(200).json({
      message: "NewDetail retrieved successfully",
      data: newDetail,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving NewDetail", error: error.message });
  }
};

// Update a NewDetail by ID
exports.updateNewDetailById = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const newDetail = await NewDetail.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
      .populate("workOrder_Id")
      .populate("pic")
      .populate("wash_detail_id")
      .populate("style_detail_id");

    if (!newDetail) {
      return res.status(404).json({ message: "NewDetail not found" });
    }

    res.status(200).json({
      message: "NewDetail updated successfully",
      data: newDetail,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating NewDetail", error: error.message });
  }
};

// Delete a NewDetail by ID
exports.deleteNewDetailById = async (req, res) => {
  try {
    const { id } = req.params;
    const newDetail = await NewDetail.findByIdAndDelete(id);

    if (!newDetail) {
      return res.status(404).json({ message: "NewDetail not found" });
    }

    res.status(200).json({
      message: "NewDetail deleted successfully",
      data: newDetail,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting NewDetail", error: error.message });
  }
};

// Get all NewDetails
exports.getAllNewDetails = async (req, res) => {
  try {
    const newDetails = await NewDetail.find()
      .populate("workOrder_Id")
      .populate("pic")
      .populate("wash_detail_id")
      .populate("style_detail_id");

    res.status(200).json({
      message: "NewDetails retrieved successfully",
      data: newDetails,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving NewDetails", error: error.message });
  }
};
// Get all NewDetails against workorder
exports.getAllNewDetailsByWorkOrderID = async (req, res) => {
  try {
    const { workOrderId, styleDetailId, washDetailId } = req.body;
    if (!workOrderId) {
      return res.status(400).json({
        message: "Invalid workOrderId provided",
      });
    }
    let newDetails;
    if (styleDetailId) {
      newDetails = await NewDetail.find({
        workOrder_Id: workOrderId,
        style_detail_id: styleDetailId,
      }).populate("pic");
    } else if (washDetailId) {
      newDetails = await NewDetail.find({
        workOrder_Id: workOrderId,
        wash_detail_id: washDetailId,
      }).populate("pic");
    } else {
      return res.status(400).json({
        message: "Either styleDetailId or washDetailId must be provided",
      });
    }
    res.status(200).json({
      message: "NewDetails retrieved successfully",
      data: newDetails,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving NewDetails", error: error.message });
  }
};

exports.createColor = async (req, res) => {
  try {
    const { name, workOrder_Id, wash_detail_id, comment } = req.body;

    if (!name || !workOrder_Id) {
      return res
        .status(400)
        .json({ message: "Name and workOrder_Id are required" });
    }

    const newColor = new WashColor({
      name,
      workOrder_Id,
      wash_detail_id,
      comment,
    });

    await newColor.save();

    res.status(201).json({
      message: "Color created successfully",
      data: newColor,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating Color", error: error.message });
  }
};

exports.getAllColors = async (req, res) => {
  try {
    const colors = await WashColor.find();
    res.status(200).json(colors);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Colors", error: error.message });
  }
};

exports.getAllColorsByWorkOrderID = async (req, res) => {
  try {
    const { workOrder_Id } = req.body;
    const colors = await WashColor.find({ workOrder_Id: workOrder_Id });
    res.status(200).json(colors);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Colors", error: error.message });
  }
};
exports.getColorById = async (req, res) => {
  try {
    const { id } = req.params;
    const color = await WashColor.findById(id);

    if (!color) {
      return res.status(404).json({ message: "Color not found" });
    }

    res.status(200).json(color);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Color", error: error.message });
  }
};

exports.updateColorById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, workOrder_Id, wash_detail_id, comment } = req.body;

    const updatedColor = await WashColor.findByIdAndUpdate(
      id,
      { name, workOrder_Id, wash_detail_id, comment },
      { new: true }
    );

    if (!updatedColor) {
      return res.status(404).json({ message: "Color not found" });
    }

    res.status(200).json({
      message: "Color updated successfully",
      data: updatedColor,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating Color", error: error.message });
  }
};

exports.deleteColorById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedColor = await Color.findByIdAndDelete(id);

    if (!deletedColor) {
      return res.status(404).json({ message: "Color not found" });
    }

    res.status(200).json({
      message: "Color deleted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting Color", error: error.message });
  }
};

// Create an ItemDetail
exports.createItemDetail = async (req, res) => {
  try {
    const itemDetail = new ItemDetail(req.body);
    await itemDetail.save();
    res
      .status(201)
      .json({ message: "ItemDetail created successfully", data: itemDetail });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating ItemDetail", error: error.message });
  }
};

// Get all ItemDetails
exports.getAllItemDetails = async (req, res) => {
  try {
    const itemDetails = await ItemDetail.find()
      .populate("workOrder_Id")
      .populate("client_Id")
      .populate("color_Id");
    res.status(200).json({
      message: "All ItemDetails retrieved successfully",
      data: itemDetails,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving ItemDetails", error: error.message });
  }
};

// Get all ItemDetails
exports.getAllItemDetailsByWorkOrderID = async (req, res) => {
  try {
    const { workOrder_Id } = req.body;
    if (!workOrder_Id) {
      return res.status(400).json({
        message: "Invalid ID provided",
      });
    }
    const itemDetails = await ItemDetail.find({ workOrder_Id: workOrder_Id })
      .populate("client_Id")
      .populate("color_Id")
      .populate("class_Id");
    res.status(200).json({
      message: "All ItemDetails retrieved successfully",
      data: itemDetails,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving ItemDetails", error: error.message });
  }
};
// Get an ItemDetail by ID
exports.getItemDetailById = async (req, res) => {
  try {
    const { id } = req.params;
    const itemDetail = await ItemDetail.findById(id)
      .populate("workOrder_Id")
      .populate("client_Id")
      .populate("color_Id");
    if (!itemDetail) {
      return res.status(404).json({ message: "ItemDetail not found" });
    }
    res
      .status(200)
      .json({ message: "ItemDetail retrieved successfully", data: itemDetail });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving ItemDetail", error: error.message });
  }
};

// Update an ItemDetail by ID
exports.updateItemDetailById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItemDetail = await ItemDetail.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedItemDetail) {
      return res.status(404).json({ message: "ItemDetail not found" });
    }
    res.status(200).json({
      message: "ItemDetail updated successfully",
      data: updatedItemDetail,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating ItemDetail", error: error.message });
  }
};

// Delete an ItemDetail by ID
exports.deleteItemDetailById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItemDetail = await ItemDetail.findByIdAndDelete(id);
    if (!deletedItemDetail) {
      return res.status(404).json({ message: "ItemDetail not found" });
    }
    res.status(200).json({ message: "ItemDetail deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting ItemDetail", error: error.message });
  }
};

// Create SampleGradedSpecs
exports.createSampleGradedSpecs = async (req, res) => {
  try {
    const {
      workOrder_Id,
      garment_type_Id,
      size_range_Id,
      spec_template_Id,
      style_nummber,
      fabric_content,
      customer_or_brand,
      size,
      garment_specs_details,
    } = req.body;

    const newSampleGradedSpecs = new SampleGradedSpecs({
      workOrder_Id,
      garment_type_Id,
      size_range_Id,
      spec_template_Id,
      style_nummber,
      fabric_content,
      customer_or_brand,
      size,
      garment_specs_details,
    });
    const savedSampleGradedSpecs = await newSampleGradedSpecs.save();

    // Create and save the DesignComments with the IDs
    const newDesignComments = new DesignComments({
      workOrder_Id,
      sampleGradedSpecs_id: savedSampleGradedSpecs._id,
    });

    await newDesignComments.save();

    // Create and save the DesignComments with the IDs
    const newFitComments = new FitComments({
      workOrder_Id,
      sampleGradedSpecs_id: savedSampleGradedSpecs._id,
    });

    await newFitComments.save();
    res.status(201).json({
      message: "Sample Graded Specs created successfully",
      data: newSampleGradedSpecs,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating Sample Graded Specs",
      error: error.message,
    });
  }
};

// Get All SampleGradedSpecs
exports.getAllSampleGradedSpecs = async (req, res) => {
  try {
    const sampleGradedSpecsList = await SampleGradedSpecs.find().populate(
      "workOrder_Id garment_type_Id size_range_Id spec_template_Id"
    );
    res.status(200).json({
      message: "Sample Graded Specs fetched successfully",
      data: sampleGradedSpecsList,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching Sample Graded Specs",
      error: error.message,
    });
  }
};

// Get All SampleGradedSpecs against workorder
exports.getAllSampleGradedSpecsByWorkOrderID = async (req, res) => {
  try {
    const { workOrder_Id } = req.body;
    if (!workOrder_Id) {
      return res.status(400).json({
        message: "Invalid ID provided",
      });
    }
    const sampleGradedSpecsList = await SampleGradedSpecs.find({ workOrder_Id: workOrder_Id }).populate(
      "garment_type_Id size_range_Id spec_template_Id"
    );
    res.status(200).json({
      message: "Sample Graded Specs fetched successfully",
      data: sampleGradedSpecsList,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching Sample Graded Specs",
      error: error.message,
    });
  }
};
// Get SampleGradedSpecs By ID
exports.getSampleGradedSpecsById = async (req, res) => {
  try {
    const { id } = req.params;
    const sampleGradedSpecs = await SampleGradedSpecs.findById(id).populate(
      "workOrder_Id garment_type_Id size_range_Id spec_template_Id"
    );
    if (!sampleGradedSpecs) {
      return res.status(404).json({ message: "Sample Graded Specs not found" });
    }
    res.status(200).json({
      message: "Sample Graded Specs fetched successfully",
      data: sampleGradedSpecs,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching Sample Graded Specs",
      error: error.message,
    });
  }
};

// Update SampleGradedSpecs By ID
exports.updateSampleGradedSpecsById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedSampleGradedSpecs = await SampleGradedSpecs.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );
    if (!updatedSampleGradedSpecs) {
      return res.status(404).json({ message: "Sample Graded Specs not found" });
    }
    res.status(200).json({
      message: "Sample Graded Specs updated successfully",
      data: updatedSampleGradedSpecs,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating Sample Graded Specs",
      error: error.message,
    });
  }
};

// Delete SampleGradedSpecs By ID
exports.deleteSampleGradedSpecsById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSampleGradedSpecs = await SampleGradedSpecs.findByIdAndDelete(
      id
    );
    if (!deletedSampleGradedSpecs) {
      return res.status(404).json({ message: "Sample Graded Specs not found" });
    }
    res.status(200).json({
      message: "Sample Graded Specs deleted successfully",
      data: deletedSampleGradedSpecs,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting Sample Graded Specs",
      error: error.message,
    });
  }
};

// Create Design Comment
exports.createDesignComment = async (req, res) => {
  try {
    const {
      sampleGradedSpecs_id,
      workOrder_Id,
      sampleStatus_id,
      sampleRequestingStatus_id,
    } = req.body;

    const newDesignComment = new DesignComments({
      sampleGradedSpecs_id,
      workOrder_Id,
      sampleStatus_id,
      sampleRequestingStatus_id,
    });

    const savedDesignComment = await newDesignComment.save();

    res.status(201).json({
      message: "Design Comment created successfully",
      data: savedDesignComment,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating Design Comment", error: error.message });
  }
};

// Get All Design Comments
exports.getAllDesignComments = async (req, res) => {
  try {
    const designComments = await DesignComments.find()
      .populate("sampleGradedSpecs_id")
      .populate("workOrder_Id")
      .populate("sampleStatus_id")
      .populate("sampleRequestingStatus_id");

    res.status(200).json({
      message: "Design Comments fetched successfully",
      data: designComments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching Design Comments",
      error: error.message,
    });
  }
};

// Get Single Design Comment by ID
exports.getDesignCommentById = async (req, res) => {
  try {
    const { id } = req.params;
    const designComment = await DesignComments.findById(id)
      .populate("sampleGradedSpecs_id")
      .populate("workOrder_Id")
      .populate("sampleStatus_id")
      .populate("sampleRequestingStatus_id");

    if (!designComment) {
      return res.status(404).json({ message: "Design Comment not found" });
    }

    res.status(200).json({
      message: "Design Comment fetched successfully",
      data: designComment,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Design Comment", error: error.message });
  }
};

// Update Design Comment
exports.updateDesignComment = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedDesignComment = await DesignComments.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
      }
    )
      .populate("sampleGradedSpecs_id")
      .populate("workOrder_Id")
      .populate("sampleStatus_id")
      .populate("sampleRequestingStatus_id");

    if (!updatedDesignComment) {
      return res.status(404).json({ message: "Design Comment not found" });
    }

    res.status(200).json({
      message: "Design Comment updated successfully",
      data: updatedDesignComment,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating Design Comment", error: error.message });
  }
};

// Delete Design Comment
exports.deleteDesignComment = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDesignComment = await DesignComments.findByIdAndDelete(id);

    if (!deletedDesignComment) {
      return res.status(404).json({ message: "Design Comment not found" });
    }

    res.status(200).json({
      message: "Design Comment deleted successfully",
      data: deletedDesignComment,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting Design Comment", error: error.message });
  }
};

// Create FitComments
exports.createFitComment = async (req, res) => {
  try {
    const {
      sampleGradedSpecs_id,
      workOrder_Id,
      sampleStatus_id,
      sampleRequestingStatus_id,
    } = req.body;

    const newFitComment = new FitComments({
      sampleGradedSpecs_id,
      workOrder_Id,
      sampleStatus_id,
      sampleRequestingStatus_id,
    });

    await newFitComment.save();

    res.status(201).json({
      message: "Fit Comment created successfully",
      data: newFitComment,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating Fit Comment", error: error.message });
  }
};

// Get all FitComments
exports.getAllFitComments = async (req, res) => {
  try {
    const fitComments = await FitComments.find().populate([
      { path: "sampleGradedSpecs_id" },
      { path: "workOrder_Id" },
      { path: "sampleStatus_id" },
      { path: "sampleRequestingStatus_id" },
    ]);

    res.status(200).json({
      message: "Fit Comments fetched successfully",
      data: fitComments,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Fit Comments", error: error.message });
  }
};

// Get FitComment by ID
exports.getFitCommentById = async (req, res) => {
  try {
    const { id } = req.params;

    const fitComment = await FitComments.findById(id).populate([
      { path: "sampleGradedSpecs_id" },
      { path: "workOrder_Id" },
      { path: "sampleStatus_id" },
      { path: "sampleRequestingStatus_id" },
    ]);

    if (!fitComment) {
      return res.status(404).json({ message: "Fit Comment not found" });
    }

    res
      .status(200)
      .json({ message: "Fit Comment fetched successfully", data: fitComment });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Fit Comment", error: error.message });
  }
};

// Update FitComment by ID
exports.updateFitCommentById = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedFitComment = await FitComments.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedFitComment) {
      return res.status(404).json({ message: "Fit Comment not found" });
    }

    res.status(200).json({
      message: "Fit Comment updated successfully",
      data: updatedFitComment,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating Fit Comment", error: error.message });
  }
};

// Delete FitComment by ID
exports.deleteFitCommentById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedFitComment = await FitComments.findByIdAndDelete(id);

    if (!deletedFitComment) {
      return res.status(404).json({ message: "Fit Comment not found" });
    }

    res.status(200).json({ message: "Fit Comment deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting Fit Comment", error: error.message });
  }
};

exports.sendWorkOrderEmail = async (req, res) => {
  const { id, email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Recipient email is required" });
  }

  try {
    await sendWorkOrderEmail(id, email);
    res.status(200).json({ message: "Work order email sent successfully" });
  } catch (error) {
    console.error("Error sending work order email:", error.message);
    res.status(500).json({ error: "Failed to send work order email" });
  }
};
exports.generatePDF = async (req, res) => {
  try {
    const { id } = req.params;
    // Fetch the work order details from the database
    const workOrderData = await workOrder
      .findById(id)
      .populate("vendor")
      .populate("category")
      .populate("itemType")
      .populate("subCategory")
      .populate("trim_id")
      .populate({
        path: "rivetImages.image",
        model: "Picture",
      })
      .populate("pictures")
      .populate({
        path: "buttonImages.image",
        model: "Picture",
      })
      .populate({
        path: "trimImages.image",
        model: "Picture",
      });

    const itemDetails = await ItemDetail.find({ workOrder_Id: id })
      .populate("client_Id")
      .populate("color_Id")
      .populate("class_Id");

    const styleDetails = await StyleDetail.find({ workOrder_Id: id });
    const styleDetailsID = styleDetails[0]._id;
    const washDetails = await WashDetail.find({ workOrder_Id: id })
    const washDetailsID = washDetails[0]._id;
    const sampleRequests = await SampleRequest.find({ workOrder_Id: id });

    let style_new_details;
    let wash_new_color;
    let wash_new_details;
    style_new_details = await NewDetail.find({
      workOrder_Id: id,
      style_detail_id: styleDetailsID,
    }).populate("pic");
    wash_new_color = await WashColor.find({
      workOrder_Id: id,
      wash_detail_id: washDetailsID,
    });
    wash_new_details = await NewDetail.find({
      workOrder_Id: id,
      wash_detail_id: washDetailsID,
    }).populate("pic");

    const responseData = {
      work_order_details: workOrderData || null,
      item_details: itemDetails || [],
      style_details: styleDetails || [],
      style_new_details: style_new_details || [],
      wash_details: washDetails || [],
      wash_new_color: wash_new_color || [],
      wash_new_details: wash_new_details || [],
      sample_request: sampleRequests || [],
    };
    res
      .status(200)
      .json({ data: responseData });
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
