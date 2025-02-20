// import React, { useState, useEffect } from "react";
// import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
// import DialogContent from "@mui/material/DialogContent";
// import DialogTitle from "@mui/material/DialogTitle";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// import Grid from "@mui/material/Grid";
// import IconButton from "@mui/material/IconButton";
// import DeleteIcon from "@mui/icons-material/Delete"; 
// import axios from "axios";

// const StyleDetailModal = ({
//   isOpen,
//   closeModal,
//   onSubmit,
//   techPackData,
//   techPackId,
// }) => {
//   const techPackID = techPackId;
//   const id = techPackData?._id;
  
//   const [formData, setFormData] = useState({
//     description: techPackData?.description || "",
//     frontPocket: techPackData?.frontPocket || "",
//     waistband: techPackData?.waistband || "",
//     flyArea: techPackData?.flyArea || "",
//     stitchingThickness: techPackData?.stitchingThickness || "",
//     inseam: techPackData?.inseam || "",
//     zipper: techPackData?.zipper || "",
//     fabric: techPackData?.fabric || "",
//     backPocket: techPackData?.backPocket || "",
//     beltLoop: techPackData?.beltLoop || "",
//     backYoke: techPackData?.backYoke || "",
//     sewingThreadColor: techPackData?.sewingThreadColor || "",
//     hem: techPackData?.hem || "",
//     summary: techPackData?.summary || "",
//     dynamicAttributes: techPackData?.dynamicAttributes || {},
//     samplePicture: techPackData?.samplePicture || null, // Start with null
//     workOrder_Id: techPackID,
//   });

//   useEffect(() => {
//     if (techPackData) {
//       setFormData({
//         description: techPackData.description || "",
//         fabric: techPackData.fabric || "",
//         inseam: techPackData.inseam || "",
//         stitchingThickness: techPackData.stitchingThickness || "",
//         sewingThreadColor: techPackData.sewingThreadColor || "",
//         summary: techPackData.summary || "",
//         samplePicture: techPackData.samplePicture || null, // Update the samplePicture field
//       });
//     }
//   }, [techPackData]);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const [dynamicFields, setDynamicFields] = useState([]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleDynamicFieldChange = (index, fieldName, value) => {
//     const updatedFields = [...dynamicFields];
//     updatedFields[index] = { ...updatedFields[index], [fieldName]: value };
//     setDynamicFields(updatedFields);

//     const updatedDynamicAttributes = { ...formData.dynamicAttributes };
//     updatedDynamicAttributes[index] = value; // Store only the value
//     setFormData({
//       ...formData,
//       dynamicAttributes: updatedDynamicAttributes,
//     });
//   };

//   const handleAddDetail = () => {
//     setDynamicFields([...dynamicFields, { key: "", value: "" }]);
//   };

//   const handleDeleteDetail = (index) => {
//     const updatedFields = dynamicFields.filter((_, idx) => idx !== index);
//     setDynamicFields(updatedFields);

//     const updatedDynamicAttributes = { ...formData.dynamicAttributes };
//     delete updatedDynamicAttributes[index];
//     setFormData({
//       ...formData,
//       dynamicAttributes: updatedDynamicAttributes,
//     });
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData({
//         ...formData,
//         samplePicture: file, // Store the file
//       });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     const formDataToSend = new FormData();
//     formDataToSend.append("description", formData.description);
//     formDataToSend.append("frontPocket", formData.frontPocket);
//     formDataToSend.append("waistband", formData.waistband);
//     formDataToSend.append("flyArea", formData.flyArea);
//     formDataToSend.append("stitchingThickness", formData.stitchingThickness);
//     formDataToSend.append("inseam", formData.inseam);
//     formDataToSend.append("zipper", formData.zipper);
//     formDataToSend.append("fabric", formData.fabric);
//     formDataToSend.append("backPocket", formData.backPocket);
//     formDataToSend.append("beltLoop", formData.beltLoop);
//     formDataToSend.append("backYoke", formData.backYoke);
//     formDataToSend.append("sewingThreadColor", formData.sewingThreadColor);
//     formDataToSend.append("hem", formData.hem);
//     formDataToSend.append("summary", formData.summary);
//     formDataToSend.append("workOrder_Id", techPackId);

//     // Add dynamic attributes
//     Object.keys(formData.dynamicAttributes).forEach((key) => {
//       formDataToSend.append(`dynamicAttributes[${key}]`, formData.dynamicAttributes[key]);
//     });

//     // Add sample picture if it exists
//     if (formData.samplePicture) {
//       formDataToSend.append("samplePicture", formData.samplePicture);
//     }

//     try {
//       const response = techPackData
//         ? await axios.put(
//             `/api/work-orders/styled-detail/${id}`, 
//             formDataToSend 
//           )
//         : await axios.post(
//             "/api/work-orders/styled-detail/create", 
//             formDataToSend
//           );

//       const newStyleDetailData = response.data.data;
//       onSubmit(newStyleDetailData); // Send the new or updated style detail data
//       closeModal(); // Close modal after submission
//     } catch (err) {
//       console.error("Error submitting form:", err);
//       setError("There was an error submitting the form. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onClose={closeModal}>
//       <DialogTitle>{techPackData ? "Edit" : "Add"} Style Detail</DialogTitle>
//       <form onSubmit={handleSubmit}>
//         <DialogContent>
//           {/* New file input for sample picture */}
//           <input
//             type="file"
//             name="samplePicture"
//             onChange={handleFileChange}
//             accept="image/*"
//             style={{ marginBottom: "10px" }}
//           />
//           {formData.samplePicture && (
//             <div>
//               <strong>Selected Image:</strong>
//               <img
//                 src={URL.createObjectURL(formData.samplePicture)}
//                 alt="Selected sample"
//                 style={{ maxWidth: "200px", marginTop: "10px" }}
//               />
//             </div>
//           )}
//           <TextField
//             fullWidth
//             label="Description"
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             required
//             margin="normal"
//           />
//           <TextField
//             fullWidth
//             label="Front Pocket"
//             name="frontPocket"
//             value={formData.frontPocket}
//             onChange={handleChange}
//             margin="normal"
//           />
//           <TextField
//             fullWidth
//             label="Waistband"
//             name="waistband"
//             value={formData.waistband}
//             onChange={handleChange}
//             margin="normal"
//           />
//           <TextField
//             fullWidth
//             label="Fly Area"
//             name="flyArea"
//             value={formData.flyArea}
//             onChange={handleChange}
//             margin="normal"
//           />
//           <TextField
//             fullWidth
//             label="Stitching Thickness"
//             name="stitchingThickness"
//             value={formData.stitchingThickness}
//             onChange={handleChange}
//             margin="normal"
//           />
//           <TextField
//             fullWidth
//             label="Inseam"
//             name="inseam"
//             value={formData.inseam}
//             onChange={handleChange}
//             margin="normal"
//           />
//           <TextField
//             fullWidth
//             label="Zipper"
//             name="zipper"
//             value={formData.zipper}
//             onChange={handleChange}
//             margin="normal"
//           />
     
        

//           <TextField
//             fullWidth
//             label="Fabric"
//             name="fabric"
//             value={formData.fabric}
//             onChange={handleChange}
//             margin="normal"
//           />
//           <TextField
//             fullWidth
//             label="Back Pocket"
//             name="backPocket"
//             value={formData.backPocket}
//             onChange={handleChange}
//             margin="normal"
//           />
//           <TextField
//             fullWidth
//             label="Belt Loop"
//             name="beltLoop"
//             value={formData.beltLoop}
//             onChange={handleChange}
//             margin="normal"
//           />
//           <TextField
//             fullWidth
//             label="Back Yoke"
//             name="backYoke"
//             value={formData.backYoke}
//             onChange={handleChange}
//             margin="normal"
//           />
//           <TextField
//             fullWidth
//             label="Sewing Thread Color"
//             name="sewingThreadColor"
//             value={formData.sewingThreadColor}
//             onChange={handleChange}
//             margin="normal"
//           />
//           <TextField
//             fullWidth
//             label="Hem"
//             name="hem"
//             value={formData.hem}
//             onChange={handleChange}
//             margin="normal"
//           />
//           <TextField
//             fullWidth
//             label="Summary"
//             name="summary"
//             value={formData.summary}
//             onChange={handleChange}
//             multiline
//             rows={4}
//             margin="normal"
//           />
//           {/* Dynamic Attributes */}
//           <div>
//             {/* Dynamic Fields */}
//             {dynamicFields.map((field, index) => (
//               <Grid
//                 container
//                 spacing={2}
//                 key={index}
//                 style={{ marginTop: "10px" }}
//               >
//                 <Grid item xs={5}>
//                   <TextField
//                     fullWidth
//                     label={`Key ${index + 1}`}
//                     name={`key-${index}`}
//                     value={field.key}
//                     onChange={(e) =>
//                       handleDynamicFieldChange(index, "key", e.target.value)
//                     }
//                     margin="normal"
//                   />
//                 </Grid>
//                 <Grid item xs={5}>
//                   <TextField
//                     fullWidth
//                     label={`Value ${index + 1}`}
//                     name={`value-${index}`}
//                     value={field.value}
//                     onChange={(e) =>
//                       handleDynamicFieldChange(index, "value", e.target.value)
//                     }
//                     margin="normal"
//                   />
//                 </Grid>
//                 <Grid item xs={2}>
//                   <IconButton
//                     onClick={() => handleDeleteDetail(index)}
//                     color="secondary"
//                     style={{ marginTop: "16px" }}
//                   >
//                     <DeleteIcon />
//                   </IconButton>
//                 </Grid>
//               </Grid>
//             ))}
//           </div>

//           {/* Add Detail Button */}
//           <Button
//             onClick={handleAddDetail}
//             variant="outlined"
//             color="primary"
//             style={{ marginTop: "10px" }}
//           >
//             Add Detail
//           </Button>

//           {error && (
//             <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button
//             type="submit"
//             color="primary"
//             variant="contained"
//             disabled={loading}
//           >
//             {loading ? "Submitting..." : "Submit"}
//           </Button>
//           <Button onClick={closeModal} color="secondary">
//             Cancel
//           </Button>
//         </DialogActions>
//       </form>
//     </Dialog>
//   );
// };

// export default StyleDetailModal;
import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete"; // Import Delete icon
import axios from "axios";

const StyleDetailModal = ({
  isOpen,
  closeModal,
  onSubmit,
  techPackData,
  techPackId,
}) => {
  const techPackID = techPackId;
  const id = techPackData?._id;
  
  const [formData, setFormData] = useState({
    description: techPackData?.description || "",
    frontPocket: techPackData?.frontPocket || "",
    waistband: techPackData?.waistband || "",
    flyArea: techPackData?.flyArea || "",
    stitchingThickness: techPackData?.stitchingThickness || "",
    inseam: techPackData?.inseam || "",
    zipper: techPackData?.zipper || "",
    samplePicture: techPackData?.samplePicture || "",
    fabric: techPackData?.fabric || "",
    backPocket: techPackData?.backPocket || "",
    beltLoop: techPackData?.beltLoop || "",
    backYoke: techPackData?.backYoke || "",
    sewingThreadColor: techPackData?.sewingThreadColor || "",
    hem: techPackData?.hem || "",
    summary: techPackData?.summary || "",
    dynamicAttributes: techPackData?.dynamicAttributes || {},
    workOrder_Id: techPackID,
  });
  useEffect(() => {
    if (techPackData) {
      setFormData({
        description: techPackData.description || "",
        fabric: techPackData.fabric || "",
        inseam: techPackData.inseam || "",
        stitchingThickness: techPackData.stitchingThickness || "",
        sewingThreadColor: techPackData.sewingThreadColor || "",
        summary: techPackData.summary || "",
        samplePicture: techPackData.samplePicture || "",
      });
    }
  }, [techPackData]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for managing dynamic attributes fields
  const [dynamicFields, setDynamicFields] = useState([]);
  const [imagePreview, setImagePreview] = useState(formData.samplePicture); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDynamicFieldChange = (index, fieldName, value) => {
    const updatedFields = [...dynamicFields];
    updatedFields[index] = { ...updatedFields[index], [fieldName]: value };
    setDynamicFields(updatedFields);

    // Update dynamicAttributes in formData with correct key-value format
    const updatedDynamicAttributes = { ...formData.dynamicAttributes };
    updatedDynamicAttributes[index] = value; // Store only the value
    setFormData({
      ...formData,
      dynamicAttributes: updatedDynamicAttributes,
    });
  };

  const handleAddDetail = () => {
    setDynamicFields([...dynamicFields, { key: "", value: "" }]);
  };

  const handleDeleteDetail = (index) => {
    const updatedFields = dynamicFields.filter((_, idx) => idx !== index);
    setDynamicFields(updatedFields);

    const updatedDynamicAttributes = { ...formData.dynamicAttributes };
    delete updatedDynamicAttributes[index];
    setFormData({
      ...formData,
      dynamicAttributes: updatedDynamicAttributes,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        samplePicture: file,
      });
  
      // Preview image
      // const reader = new FileReader();
      // reader.onloadend = () => {
      //   setImagePreview(reader.result); // base64 preview
      // };
      // reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const requestData = {
      description: formData.description,
      frontPocket: formData.frontPocket,
      waistband: formData.waistband,
      flyArea: formData.flyArea,
      stitchingThickness: formData.stitchingThickness,
      inseam: formData.inseam,
      zipper: formData.zipper,
      samplePicture: formData.samplePicture,
      fabric: formData.fabric,
      backPocket: formData.backPocket,
      beltLoop: formData.beltLoop,
      backYoke: formData.backYoke,
      sewingThreadColor: formData.sewingThreadColor,
      hem: formData.hem,
      summary: formData.summary,
      dynamicAttributes: formData.dynamicAttributes,
      workOrder_Id: techPackId,
    };

    try {
      const response = techPackData
        ? await axios.put(
            `/api/work-orders/styled-detail/${id}`, 
            requestData 
          )
        : await axios.post(
            "/api/work-orders/styled-detail/create", 
            requestData
          );

      const newStyleDetailData = response.data.data;
      onSubmit(newStyleDetailData); // Send the new or updated style detail data
      closeModal(); // Close modal after submission
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("There was an error submitting the form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={closeModal}>
      <DialogTitle>{techPackData ? "Edit" : "Add"} Style Detail</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Front Pocket"
            name="frontPocket"
            value={formData.frontPocket}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Waistband"
            name="waistband"
            value={formData.waistband}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Fly Area"
            name="flyArea"
            value={formData.flyArea}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Stitching Thickness"
            name="stitchingThickness"
            value={formData.stitchingThickness}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Inseam"
            name="inseam"
            value={formData.inseam}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Zipper"
            name="zipper"
            value={formData.zipper}
            onChange={handleChange}
            margin="normal"
          />
          {/* Image Upload */}
          {/* <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ marginTop: "16px" }}
            />
            {imagePreview && (
              <div style={{ marginTop: "10px" }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxWidth: "100px", maxHeight: "100px" }}
                />
              </div>
            )}
          </div> */}

          <TextField
            fullWidth
            label="Fabric"
            name="fabric"
            value={formData.fabric}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Back Pocket"
            name="backPocket"
            value={formData.backPocket}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Belt Loop"
            name="beltLoop"
            value={formData.beltLoop}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Back Yoke"
            name="backYoke"
            value={formData.backYoke}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Sewing Thread Color"
            name="sewingThreadColor"
            value={formData.sewingThreadColor}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Hem"
            name="hem"
            value={formData.hem}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            multiline
            rows={4}
            margin="normal"
          />
          {/* Dynamic Attributes */}
          <div>
            {/* Dynamic Fields */}
            {dynamicFields.map((field, index) => (
              <Grid
                container
                spacing={2}
                key={index}
                style={{ marginTop: "10px" }}
              >
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    label={`Key ${index + 1}`}
                    name={`key-${index}`}
                    value={field.key}
                    onChange={(e) =>
                      handleDynamicFieldChange(index, "key", e.target.value)
                    }
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    label={`Value ${index + 1}`}
                    name={`value-${index}`}
                    value={field.value}
                    onChange={(e) =>
                      handleDynamicFieldChange(index, "value", e.target.value)
                    }
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton
                    onClick={() => handleDeleteDetail(index)}
                    color="secondary"
                    style={{ marginTop: "16px" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </div>

          {/* Add Detail Button */}
          <Button
            onClick={handleAddDetail}
            variant="outlined"
            color="primary"
            style={{ marginTop: "10px" }}
          >
            Add Detail
          </Button>

          {error && (
            <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
          <Button onClick={closeModal} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default StyleDetailModal;
