import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

const AddVendorPOModal = ({ open, onClose, contractToEdit, onSave }) => {
  const [selectedVendor, setSelectedVendor] = useState("");
  const [comment, setComment] = useState("");
  const [vendorData, setVendorData] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});

  // Dummy data for vendors and their associated details (replace this with your actual data fetching logic)
  const vendors = [
    { id: 1, name: "Vendor A" },
    { id: 2, name: "Vendor B" },
    { id: 3, name: "Vendor C" },
  ];

  const vendorDetails = {
    1: [
      { order: "PO001", style: "Style A", requestedETD: "2025-02-01" },
      { order: "PO002", style: "Style B", requestedETD: "2025-03-01" },
    ],
    2: [{ order: "PO003", style: "Style C", requestedETD: "2025-04-01" }],
    3: [{ order: "PO004", style: "Style D", requestedETD: "2025-05-01" }],
  };

  // Handle the vendor selection change
  const handleVendorChange = (event) => {
    const vendorId = event.target.value;
    setSelectedVendor(vendorId);
    setVendorData(vendorDetails[vendorId] || []); // Set the table data based on selected vendor
  };

  // Handle the comment change
  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  // Handle the row selection
  const handleRowSelection = (order) => {
    setSelectedRows((prev) => ({
      ...prev,
      [order]: !prev[order], // Toggle selection for the clicked row
    }));
  };

  // Handle Save action
  const handleSave = () => {
    const selectedData = Object.keys(selectedRows)
      .filter((key) => selectedRows[key])
      .map((key) => vendorData.find((data) => data.order === key));

    onSave({ selectedVendor, comment, selectedData });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 600,
          maxWidth: "90%",
          padding: 4,
          backgroundColor: "white",
          borderRadius: 2,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          boxShadow: 24,
          overflow: "hidden",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Add Vendor PO
        </Typography>

        {/* Vendor and Comment Fields in the same row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            marginBottom: 2,
          }}
        >
          <Select
            value={selectedVendor}
            onChange={handleVendorChange}
            displayEmpty
            fullWidth
            sx={{ flex: 1 }}
          >
            <MenuItem value="" disabled>
              Select Vendor
            </MenuItem>
            {vendors.map((vendor) => (
              <MenuItem key={vendor.id} value={vendor.id}>
                {vendor.name}
              </MenuItem>
            ))}
          </Select>

          <TextField
            label="Comment"
            value={comment}
            onChange={handleCommentChange}
            fullWidth
            multiline
            rows={1}
            sx={{ flex: 2 }}
          />
        </Box>

        {/* Table to display vendor data */}
        {vendorData.length > 0 && (
          <TableContainer
            component={Paper}
            sx={{ maxHeight: 400, overflowY: "auto" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Select</TableCell>
                  <TableCell>Vendor</TableCell>
                  <TableCell>Order</TableCell>
                  <TableCell>Style</TableCell>
                  <TableCell>Requested ETD</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vendorData.map((data, index) => (
                  <TableRow key={data.order}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRows[data.order] || false}
                        onChange={() => handleRowSelection(data.order)}
                      />
                    </TableCell>
                    <TableCell>
                      {
                        vendors.find(
                          (vendor) => vendor.id === parseInt(selectedVendor)
                        )?.name
                      }
                    </TableCell>
                    <TableCell>{data.order}</TableCell>
                    <TableCell>{data.style}</TableCell>
                    <TableCell>{data.requestedETD}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{ marginTop: 2 }}
        >
          Save
        </Button>
      </Box>
    </Modal>
  );
};

export default AddVendorPOModal;
