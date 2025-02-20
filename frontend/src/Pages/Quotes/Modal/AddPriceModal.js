import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";

function AddPriceModal({ open, handleClose, techPackId,handleSubmitSent }) {
 
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [vendor, setVendor] = useState("");
  const [date, setDate] = useState("");
  const [fabric, setFabric] = useState("");
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    if (open) {
        setPrice("");
    setNotes("");
    setVendor("");
    setDate("");
    setFabric("");
      axios
        .get("/api/vendors")
        .then((response) => {
          console.log("Vendors fetched:", response.data);
          setVendors(response.data);
        })
        .catch((error) => {
          console.error("Error fetching vendors:", error);
        });
    }
  }, [open]);

  const handlePriceChange = (event) => setPrice(event.target.value);
  const handleNotesChange = (event) => setNotes(event.target.value);
  const handleVendorChange = (event) => {
    console.log("Selected vendor:", event.target.value); // Debugging: Log selected vendor
    setVendor(event.target.value);
  };
  const handleDateChange = (event) => setDate(event.target.value);
  const handleFabricChange = (event) => setFabric(event.target.value);

  const handleSubmit = () => {
    const payload = {
      vendor,
      price,
      date,
      fabric,
      notes,
      techPackId,
    };

    axios
      .post("/api/techPack/quote", payload)
      .then((response) => {
        console.log("Quote added:", response.data);
        handleSubmitSent(response.data)
        handleClose(); // Close the modal after successful submission
      })
      .catch((error) => {
        console.error("Error adding quote:", error);
      });
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          width: 400,
          padding: 2,
          backgroundColor: "white",
          margin: "auto",
          marginTop: "10%",
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Add Price for TechPack
        </Typography>

        {/* Vendor */}
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Vendor</InputLabel>
          <Select
            value={vendor} // This value should be bound to the vendor state
            onChange={handleVendorChange} // Handler that updates the state when a vendor is selected
            label="Vendor"
          >
            {vendors.map((vendorItem) => (
              <MenuItem key={vendorItem._id} value={vendorItem._id}>
                {vendorItem.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Price */}
        <TextField
          label="Price"
          variant="outlined"
          fullWidth
          value={price}
          onChange={handlePriceChange}
          sx={{ marginBottom: 2 }}
        />

        {/* Date */}
        <TextField
          label="Date"
          variant="outlined"
          type="date"
          fullWidth
          value={date}
          onChange={handleDateChange}
          sx={{ marginBottom: 2 }}
          InputLabelProps={{
            shrink: true,
          }}
        />

        {/* Fabric */}
        <TextField
          label="Fabric"
          variant="outlined"
          fullWidth
          value={fabric}
          onChange={handleFabricChange}
          sx={{ marginBottom: 2 }}
        />

        {/* Notes */}
        <TextField
          label="Notes"
          variant="outlined"
          fullWidth
          value={notes}
          onChange={handleNotesChange}
          sx={{ marginBottom: 2 }}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={handleClose} sx={{ marginRight: 1 }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddPriceModal;
