import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddSpecsModal = ({ isOpen, closeModal, onSubmit }) => {
  const [formData, setFormData] = useState({
    Name: "",
    Garment_Type: "",
    Size_Range: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [Garment_Type, setGarment_Type] = useState([]);

  // Static size range options
  const Size_Range = [
    { id: "1-0", label: "1-0" },
    { id: "1-19", label: "1-19" },
  ];

  useEffect(() => {
    const fetchGarment_Type = async () => {
      try {
        const response = await axios.get("garment-type");
        setGarment_Type(response.data);
      } catch (err) {
        console.error("Error fetching garment types:", err);
        setError("Failed to fetch garment type options.");
      }
    };

    fetchGarment_Type();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        Name: "",
        Garment_Type: "",
        Size_Range: "",
      });
    }
  }, [isOpen]);

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
      const response = await axios.post("specs-template", formData);
      onSubmit(formData);
      closeModal();
    } catch (err) {
      setError("There was an error submitting the form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={closeModal} fullWidth maxWidth="sm">
      <DialogTitle>Add Specs Template</DialogTitle>
      <DialogContent>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <TextField
              fullWidth
              label="Name"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              required
              style={{ marginBottom: "15px" }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <FormControl fullWidth required>
              <InputLabel>Garment Type</InputLabel>
              <Select
                name="Garment_Type"
                value={formData.Garment_Type}
                onChange={handleChange}
                label="Garment Type"
              >
                <MenuItem value="">Select Garment Type</MenuItem>
                {Garment_Type.map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.Garment_Type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div style={{ marginBottom: "15px" }}>
            <FormControl fullWidth required>
              <InputLabel>Size Range</InputLabel>
              <Select
                name="Size_Range"
                value={formData.Size_Range}
                onChange={handleChange}
                label="Size Range"
              >
                <MenuItem value="">Select Size Range</MenuItem>
                {Size_Range.map((range) => (
                  <MenuItem key={range.id} value={range.id}>
                    {range.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <DialogActions>
            <Button onClick={closeModal} color="secondary">
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={loading}
              style={{ width: "100%" }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Submit"
              )}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSpecsModal;
