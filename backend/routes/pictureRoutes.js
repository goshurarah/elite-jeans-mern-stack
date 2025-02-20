
const express = require("express");
const multer = require("multer");
const { 
  uploadImage,
  getCategories,
  getImagesByCategory,
  deleteImage,
  activateImage,
  deactivateImage,
  updateImage,
  getImages,
  getAllPictures,
} = require("../controllers/pictureController");

const router = express.Router();
const upload = multer(); 

router.post("/", upload.single("imageUrl"), uploadImage); 

router.get("/", getAllPictures);
router.get("/cat_name", getCategories); 
router.get("/:category", getImagesByCategory); 


router.get("/images", getImages); 
router.delete("/:id", deleteImage); 

router.patch("/activate/:id", activateImage);
router.patch("/deactivate/:id", deactivateImage); 
router.put("/update/:id", updateImage); 

module.exports = router;

