const express = require("express");
const {
  createRange,
  getAllRanges,
  getRangeById,
  updateRangeById,
  deleteRangeById,
  getAllNamesAndIds,
} = require("../controllers/sizeRangeController");
const router = express.Router();
router.get("/allget", getAllNamesAndIds);
router.post("/", createRange);
router.get("/", getAllRanges);
router.get("/:id", getRangeById);
router.put("/:id", updateRangeById);
router.delete("/:id", deleteRangeById);
module.exports = router;
