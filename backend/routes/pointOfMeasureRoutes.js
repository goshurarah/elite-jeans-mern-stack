const express = require("express");
const router = express.Router();
const {
  createPointOfMeasure,
  getAllPointsOfMeasure,
  getPointOfMeasureById,
  updatePointOfMeasure,
  deletePointOfMeasure,
  filterPointOfMeasures,
} = require("../controllers/pointOfMeasureController");

router.get("/filter", filterPointOfMeasures);
router.post("/", createPointOfMeasure); 
router.get("/", getAllPointsOfMeasure); 
router.get("/:id", getPointOfMeasureById); 
router.put("/:id", updatePointOfMeasure); 
router.delete("/:id", deletePointOfMeasure); 


module.exports = router;
