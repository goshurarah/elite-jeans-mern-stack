const express = require("express");
const multer = require("multer");
const {
  createTrim,
  getTrims,
  getTrimById,
  updateTrim,
  deleteTrim,
  Names,
  filterNames,
} = require("../controllers/trimController");

const router = express.Router();
const upload = multer(); 

router.post("/", upload.single("previewImage"), createTrim); 

router.get("/", getTrims); 
router.get("/getnames", Names);
router.get("/names", filterNames);
router.get("/:id", getTrimById); 
router.put("/:id", updateTrim); 
router.delete("/:id", deleteTrim); 
 

module.exports = router;
