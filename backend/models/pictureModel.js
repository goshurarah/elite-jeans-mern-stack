// const mongoose = require("mongoose");

// // Picture Schema
// const PictureSchema = new mongoose.Schema({
//   category: {
//     type: String,
//     required: true,
//   },
//   imageUrl: {
//     type: String,
//   },
//   active: {
//     type: Boolean,
//     default: true, 
//   },
// });

// const PictureModel = mongoose.model("Picture", PictureSchema);

// module.exports = { PictureModel };
const mongoose = require("mongoose");

// Picture Schema
const PictureSchema = new mongoose.Schema({
  imageName: {
    type: String,
  },
  imageTitle: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const PictureModel = mongoose.model("Picture", PictureSchema);

module.exports = { PictureModel };
