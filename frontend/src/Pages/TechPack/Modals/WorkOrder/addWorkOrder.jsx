import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import './addWorkOrder.css';

const AddWorkOrder = ({ isOpen, closeModal, onSubmit }) => {
  const [formData, setFormData] = useState({
    etd: "",
    itemType: "",
    vendor: "",
    category: "",
    subCategory: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [itemType, setItemType] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);

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
      console.error("Error fetching item type options:", err);
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
      console.error("Error fetching sub-category options:", err);
    }
  };

  useEffect(() => {
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
      const response = await axios.post("/api/work-orders/create", formData);
      const techPackData = response.data.data; // Assuming response contains the new tech pack data
      onSubmit(techPackData);
      setFormData({
        etd: "",
        itemType: "",
        vendor: "",
        category: "",
        subCategory: "",
      });
      closeModal();
    } catch (err) {
      console.error("There was an error submitting the form:", err);
      setError("There was an error submitting the form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={closeModal} maxWidth="sm" fullWidth>
      <DialogTitle>New Work Order</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          {/* Vendor Select Field */}
          <TextField
            select
            label="Vendor"
            name="vendor"
            value={formData.vendor}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          >
            <MenuItem value="">
              <em>Select a Vendor</em>
            </MenuItem>
            {vendors?.map((vendor) => (
              <MenuItem key={vendor._id} value={vendor._id}>
                {vendor.name || "No Name Available"}
              </MenuItem>
            ))}
          </TextField>

          {/* Item Type Select Field */}
          <TextField
            select
            label="Item Type"
            name="itemType"
            value={formData.itemType}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          >
            <MenuItem value="">
              <em>Select an Item Type</em>
            </MenuItem>
            {itemType?.map((field) => (
              <MenuItem key={field._id} value={field._id}>
                {field.name || "No Name Available"}
              </MenuItem>
            ))}
          </TextField>

          {/* Category Select Field */}
          <TextField
            select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          >
            <MenuItem value="">
              <em>Select a Category</em>
            </MenuItem>
            {category?.map((field) => (
              <MenuItem key={field._id} value={field._id}>
                {field.name || "No Name Available"}
              </MenuItem>
            ))}
          </TextField>

          {/* Sub Category Select Field */}
          <TextField
            select
            label="Sub Category"
            name="subCategory"
            value={formData.subCategory}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          >
            <MenuItem value="">
              <em>Select a Sub Category</em>
            </MenuItem>
            {subCategory?.map((field) => (
              <MenuItem key={field._id} value={field._id}>
                {field.name || "No Name Available"}
              </MenuItem>
            ))}
          </TextField>

          {/* ETD Input */}
          <TextField
            type="text"
            label="ETD"
            name="etd"
            value={formData.etd}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />

          {error && <div className="error-message">{error}</div>}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddWorkOrder;
