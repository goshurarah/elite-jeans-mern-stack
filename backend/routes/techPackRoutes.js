const express = require("express");
const router = express.Router();
const {
  createTechPack,
  deleteTechPack,
  updateTechPack,
  getTechPackById,
  getAllTechPacks,
} = require("../controllers/techPackController");



router.post("/", createTechPack);

// Get all TechPacks
router.get("/", getAllTechPacks);

// Get a single TechPack by ID
router.get("/:id", getTechPackById);

// Update a TechPack by ID
router.put("/:id", updateTechPack);

// Delete a TechPack by ID
router.delete("/:id", deleteTechPack);

module.exports = router;
