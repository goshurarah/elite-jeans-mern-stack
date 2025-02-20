const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const pictureRoutes = require("./routes/pictureRoutes");
const trimRoutes = require("./routes/trimRoutes");
const techPackRoutes = require("./routes/techPackRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const subCategoryRoutes = require("./routes/subCategoryRoutes");
const itemTypeRoutes = require("./routes/itemTypeRoutes");
const colorRoutes = require("./routes/colorRoutes");
const sizeScaleRoutes = require("./routes/sizeScaleRoutes");
const sizeBreakRoutes = require("./routes/sizeBreakRoutes");
const clientRoutes = require("./routes/clientRoutes");
const salesContractRoutes = require("./routes/salesContractRoutes");
const sampleRequestRoutes = require("./routes/SampleRequestRoutes");
const styleDetailRoutes = require("./routes/StyleDetailRoutes");
const washDetailRoutes = require("./routes/WashDetailRoutes");
const pointOfMeasureRoutes = require("./routes/pointOfMeasureRoutes");
const workOrderRoutes = require("./routes/workOrderRoutes");
const newScaleAssignmentRoutes = require("./routes/newScaleAssignmentRoutes");
const classRoutes = require("./routes/classRoutes");
const specsTemplateRoutes = require("./routes/specsTemplateRoutes");
const garmentTypeRoutes = require('./routes/garmentTypeRoutes');
const sizeRangeRoutes = require('./routes/sizeRangeRoutes');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded payloads
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
app.use("/api/trim", trimRoutes);
app.use("/api/picture", pictureRoutes);
app.use("/api/techPack", techPackRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/item-types", itemTypeRoutes);
app.use("/api/colors", colorRoutes);
app.use("/api/size-scales", sizeScaleRoutes);
app.use("/api/size-breaks", sizeBreakRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/sales-contracts", salesContractRoutes);
app.use("/api/sample-requests", sampleRequestRoutes);
app.use("/api/style-details", styleDetailRoutes);
app.use("/api/wash-details", washDetailRoutes);
app.use("/api/point-of-measure", pointOfMeasureRoutes);
app.use("/api/work-orders", workOrderRoutes);
app.use("/api/new-scale-assignments", newScaleAssignmentRoutes);
app.use("/api/classes", classRoutes);
app.use("/specs-template", specsTemplateRoutes);
app.use('/garment-type', garmentTypeRoutes);
app.use('/api/size-range', sizeRangeRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));