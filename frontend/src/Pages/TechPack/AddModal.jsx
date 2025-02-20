import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import './AddModal.css';

const AddModal = ({ isOpen, closeModal, onSubmit }) => {
  const [formData, setFormData] = useState({
    styleId: "",
    itemType: "",
    vendor: "",
    category: "",
    subCategory: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [itemType, setItemType] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get("/api/vendors");
        setVendors(response.data);
      } catch (err) {
        console.error("Error fetching vendors:", err);
        setError("Failed to fetch vendor options.");
      }
    };

    const fetchItemType = async () => {
      try {
        const response = await axios.get("/api/item-types");
        setItemType(response.data);
      } catch (err) {
        console.error("Error fetching itemtype options:", err);
      }
    };

    const fetchCategory = async () => {
      try {
        const response = await axios.get("/api/categories");
        setCategory(response.data);
      } catch (err) {
        console.error("Error fetching category options:", err);
      }
    };

    const fetchSubCategory = async () => {
      try {
        const response = await axios.get("/api/subcategories");
        setSubCategory(response.data);
      } catch (err) {
        console.error("Error fetching subcategory options:", err);
      }
    };

    fetchVendors();
    fetchItemType();
    fetchCategory();
    fetchSubCategory();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/techPack", formData);
      const techPackData = response.data.data; // Assuming response contains the new tech pack data
      console.log("Data submitted successfully:", techPackData);
      onSubmit(techPackData);
      closeModal();
    } catch (err) {
      console.error("There was an error submitting the form:", err);
      setError("There was an error submitting the form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={closeModal}
      aria-labelledby="create-tech-pack-modal"
      aria-describedby="create-tech-pack-description"
    >
      <Box sx={modalStyles}>
        <h2>Create TechPack</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <TextField
              label="Style Id"
              id="styleId"
              name="styleId"
              value={formData.styleId}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
          </div>

          <div className="form-group">
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Vendor</InputLabel>
              <Select
                label="Vendor"
                id="vendor"
                name="vendor"
                value={formData.vendor}
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>Select a Vendor</em>
                </MenuItem>
                {vendors.map((vendor) => (
                  <MenuItem key={vendor._id} value={vendor._id}>
                    {vendor.name ? vendor.name : "No Name Available"}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {error && "Please select a vendor."}
              </FormHelperText>
            </FormControl>
          </div>

          <div className="form-group">
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Item Type</InputLabel>
              <Select
                label="Item Type"
                id="itemType"
                name="itemType"
                value={formData.itemType}
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>Select Item Type</em>
                </MenuItem>
                {itemType.map((field) => (
                  <MenuItem key={field._id} value={field._id}>
                    {field.name ? field.name : "No Name Available"}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {error && "Please select an item type."}
              </FormHelperText>
            </FormControl>
          </div>

          <div className="form-group">
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>Select Category</em>
                </MenuItem>
                {category.map((field) => (
                  <MenuItem key={field._id} value={field._id}>
                    {field.name ? field.name : "No Name Available"}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {error && "Please select a category."}
              </FormHelperText>
            </FormControl>
          </div>

          <div className="form-group">
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Sub Category</InputLabel>
              <Select
                label="Sub Category"
                id="subCategory"
                name="subCategory"
                value={formData.subCategory}
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>Select Sub Category</em>
                </MenuItem>
                {subCategory.map((field) => (
                  <MenuItem key={field._id} value={field._id}>
                    {field.name ? field.name : "No Name Available"}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {error && "Please select a sub category."}
              </FormHelperText>
            </FormControl>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
            <Button variant="outlined" color="secondary" onClick={closeModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

const modalStyles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  width: "400px",
  borderRadius: "8px",
};

export default AddModal;
