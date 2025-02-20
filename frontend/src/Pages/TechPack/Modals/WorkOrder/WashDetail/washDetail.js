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

const WashDetailModal = ({
  isOpen,
  closeModal,
  onSubmit,
  techPackData,
  techPackId,
}) => {
  const techPackID = techPackId;
  const id = techPackData?._id;
  
  const [formData, setFormData] = useState({
    wash: techPackData?.wash || "",
    dryProcess: techPackData?.dryProcess,
    color:techPackData?.color,
    comments:techPackData?.comments,
    dynamicAttributes: techPackData?.dynamicAttributes || {},
    workOrder_Id: techPackID,
  });
  useEffect(() => {
    if (techPackData) {
      setFormData({
        wash: techPackData?.wash || "",
        dryProcess: techPackData?.dryProcess,
        color:techPackData?.color,
        comments:techPackData?.comments,
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
      wash: formData.wash,
      dryProcess: formData.dryProcess,
      color:formData.color,
      comments:formData.comments,
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
            "/api/work-orders/wash-detail/create", 
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
            label="Wash"
            name="wash"
            value={formData.wash}
            onChange={handleChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Dry Process"
            name="dryProcess"
            value={formData.dryProcess}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Comments"
            name="comments"
            value={formData.comments}
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

export default WashDetailModal;
