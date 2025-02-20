const express = require("express");
const router = express.Router();
const multer = require("multer");
const { createWashDetail, getAllWashDetails, getWashDetailById, updateWashDetail, deleteWashDetail } = require("../controllers/WashDetailController");


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post("/create", upload.single('washPicture'), createWashDetail); 
router.get("/", getAllWashDetails); 
router.get("/:id", getWashDetailById); 
router.put("/:id", upload.single('washPicture'), updateWashDetail);
router.delete("/:id", deleteWashDetail);

module.exports = router;

