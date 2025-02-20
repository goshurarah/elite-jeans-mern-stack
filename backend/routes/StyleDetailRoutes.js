const express = require("express");
const router = express.Router();
const styleDetailController = require("../controllers/StyleDetailController");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("samplePicture"), styleDetailController.createStyleDetail);
router.get("/", styleDetailController.getAllStyleDetails);
router.get("/:id", styleDetailController.getStyleDetailById);
router.put("/:id", upload.single("samplePicture"), styleDetailController.updateStyleDetail);
router.delete("/:id", styleDetailController.deleteStyleDetail);

module.exports = router;
