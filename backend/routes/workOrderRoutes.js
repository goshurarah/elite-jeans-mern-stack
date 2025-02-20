const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
    createWorkOrderInTechPack,
    createWorkOrder,
    createRepeatWorkOrder,
    getAllWorkOrder,
    getFilteredWorkOrders,
    getWorkOrderById,
    editWorkOrder,
    createSampleRequest,
    getAllSampleRequests,
    getAllSampleRequestsByWorkOrderID,
    getSampleRequestById,
    editSampleRequest,
    deleteSampleRequest,
    createWashDetail,
    getAllWashDetails,
    getAllWashDetailsByWorkOrderID,
    getWashDetailById,
    editWashDetail,
    deleteWashDetail,
    createStyleDetail,
    getAllStyleDetails,
    getAllStyleDetailsByWorkOrderID,
    getStyleDetailById,
    editStyleDetail,
    deleteStyleDetail,
    createNewDetail,
    getAllNewDetails,
    getAllNewDetailsByWorkOrderID,
    getNewDetailById,
    updateNewDetailById,
    deleteNewDetailById,
    createColor,
    getAllColors,
    getAllColorsByWorkOrderID,
    getColorById,
    updateColorById,
    deleteColorById,
    createItemDetail,
    getAllItemDetails,
    getAllItemDetailsByWorkOrderID,
    getItemDetailById,
    updateItemDetailById,
    deleteItemDetailById,
    createSampleGradedSpecs,
    getAllSampleGradedSpecs,
    getAllSampleGradedSpecsByWorkOrderID,
    getSampleGradedSpecsById,
    updateSampleGradedSpecsById,
    deleteSampleGradedSpecsById,
    createDesignComment,
    getAllDesignComments,
    getDesignCommentById,
    updateDesignComment,
    deleteDesignComment,
    createFitComment,
    getAllFitComments,
    getFitCommentById,
    updateFitCommentById,
    deleteFitCommentById,
    sendWorkOrderEmail,
    generatePDF
} = require("../controllers/workOrderController");


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Work Order Routes
router.post("/add-teachpack/:workOrderId", createWorkOrderInTechPack);
router.post("/repeat-workorder/:workOrderId", createRepeatWorkOrder);
router.post("/create", createWorkOrder);
router.get("/filter", getFilteredWorkOrders);
router.get("/", getAllWorkOrder);
router.get("/:id", getWorkOrderById);
router.put("/:id", editWorkOrder);

// Sample Request Routes
router.post("/create-sample-request", createSampleRequest);
router.get("/sample-requests", getAllSampleRequests); // Get All
router.get("/sample-requests/:id", getSampleRequestById); // Get by ID
router.put("/create-sample-request/:id", editSampleRequest);
router.delete("/create-sample-request/:id", deleteSampleRequest);
router.post("/sample-requests-by-work-orders", getAllSampleRequestsByWorkOrderID);

// WashDetail Routes
router.post("/wash-detail/create", createWashDetail);
router.get("/wash-detail", getAllWashDetails);
router.get("/wash-detail/:id", getWashDetailById);
router.put("/wash-detail/:id", editWashDetail);
router.delete("/wash-detail/:id", deleteWashDetail);
router.post("/wash-detail-by-work-orders", getAllWashDetailsByWorkOrderID);

// StyledDetail Routes
router.post("/styled-detail/create", createStyleDetail);
router.get("/styled-detail", getAllStyleDetails);
router.get("/styled-detail/:id", getStyleDetailById);
router.put("/styled-detail/:id", editStyleDetail);
router.delete("/styled-detail/:id", deleteStyleDetail);
router.post("/styled-detail-by-work-orders", getAllStyleDetailsByWorkOrderID);

// NewDetail Routes
router.post("/new-detail/create", createNewDetail);
router.post("/new-detail", getAllNewDetails);
router.get("/new-detail/:id", getNewDetailById);
router.put("/new-detail/:id", updateNewDetailById);
router.delete("/new-detail/:id", deleteNewDetailById);
router.post("/new-detail-by-work-orders", getAllNewDetailsByWorkOrderID);


// Wash Color Routes
router.post("/wash-color/create", createColor);
router.get("/wash-color", getAllColors);
router.get("/wash-color/:id", getColorById);
router.put("/wash-color/:id", updateColorById);
router.delete("/wash-color/:id", deleteColorById);
router.post("/wash-color-by-work-orders", getAllColorsByWorkOrderID);

// ItemDetail Routes
router.post("/item-detail/create", createItemDetail);
router.get("/item-detail", getAllItemDetails);
router.post("/item-detail-by-work-orders", getAllItemDetailsByWorkOrderID);
router.get("/item-detail/:id", getItemDetailById);
router.put("/item-detail/:id", updateItemDetailById);
router.delete("/item-detail/:id", deleteItemDetailById);


// SampleGradedSpecs Routes
router.post("/sample-graded-specs/create", createSampleGradedSpecs);
router.get("/sample-graded-specs", getAllSampleGradedSpecs);
router.get("/sample-graded-specs/:id", getSampleGradedSpecsById);
router.put("/sample-graded-specs/:id", updateSampleGradedSpecsById);
router.delete("/sample-graded-specs/:id", deleteSampleGradedSpecsById);
router.post("/sample-graded-specs-by-work-orders", getAllSampleGradedSpecsByWorkOrderID);


// DesignComments Routes
router.post("/design-comments/create", createDesignComment);
router.get("/design-comments", getAllDesignComments);
router.get("/design-comments/:id", getDesignCommentById);
router.put("/design-comments/:id", updateDesignComment);
router.delete("/design-comments/:id", deleteDesignComment);


// FitComments Routes
router.post("/fit-comments/create", createFitComment);
router.get("/fit-comments", getAllFitComments);
router.get("/fit-comments/:id", getFitCommentById);
router.put("/fit-comments/:id", updateFitCommentById);
router.delete("/fit-comments/:id", deleteFitCommentById);

// Send Work Order Email
router.post("/send-work-order-email/:id", sendWorkOrderEmail);

// Route to generate and download a PDF
router.get('/download-pdf/:id', generatePDF);
module.exports = router;

