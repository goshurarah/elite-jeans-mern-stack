import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { Edit, Add, Remove } from "@mui/icons-material";

function ASNDialog({ open, onClose }) {
  const [asnNumber, setAsnNumber] = useState("");
  const [loadingDate, setLoadingDate] = useState("");
  const [vesselETD, setVesselETD] = useState("");
  const [vendor, setVendor] = useState("");
  const [portShippingForm, setPortShippingForm] = useState("");
  const [comments, setComments] = useState("");
  const [selectedItemDetails, setSelectedItemDetails] = useState([]);

  const handleEditClick = (index, row) => {
    setEditableRowData({
      quantity: row.quantity,
      cbm_per_unit: row.cbm_per_unit,
      weight: row.weight,
    });
    handleExpandClick(index);
  };

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [vendorData, setVendorData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editableRowData, setEditableRowData] = useState({});
  const [expandedRows, setExpandedRows] = useState({});

  const handleVendorChange = async (e) => {
    setSelectedVendor(e.target.value);
    setVendorData([]);
    setLoading(true);

    try {
      const response = await axios.get(`/api/asn/vendor/${e.target.value}`);
      setVendorData(response.data.data);
    } catch (error) {
      console.error("Error fetching vendor data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/vendors");
      setVendors(response.data);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleExpandClick = (index) => {
    setExpandedRows((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleSaveClick = async () => {
    const payload = {
      asnNumber,
      loadingDate,
      vesselETD,
      vendor: selectedVendor,
      portShippingForm,
      comments,
      selectedItemDetails,
    };

    try {
      const response = await axios.post("/api/asn/create", payload);
      console.log("ASN created successfully:", response.data);
      onClose(); // Close the dialog after successful save
    } catch (error) {
      console.error("Error creating ASN:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>New ASN</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              autoFocus
              margin="dense"
              label="ASN #:"
              type="text"
              fullWidth
              variant="outlined"
              value={asnNumber}
              onChange={(e) => setAsnNumber(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              margin="dense"
              label="Created Date:"
              type="text"
              fullWidth
              variant="outlined"
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              margin="dense"
              label="Loading Date:"
              type="date"
              fullWidth
              variant="outlined"
              value={loadingDate}
              onChange={(e) => setLoadingDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              margin="dense"
              label="Vessel ETD:"
              type="date"
              fullWidth
              variant="outlined"
              value={vesselETD}
              onChange={(e) => setVesselETD(e.target.value)}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} style={{ marginTop: "16px" }}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl variant="outlined" style={{ minWidth: 250 }}>
              <InputLabel id="vendor-select-label">Vendor</InputLabel>
              <Select
                value={selectedVendor}
                onChange={handleVendorChange}
                label="Vendor"
                displayEmpty
                fullWidth
              >
                {loading ? (
                  <MenuItem disabled>
                    <CircularProgress size={24} />
                  </MenuItem>
                ) : (
                  vendors.map((vendor) => (
                    <MenuItem key={vendor._id} value={vendor._id}>
                      {vendor.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              margin="dense"
              label="Port Shipping From:"
              type="text"
              fullWidth
              variant="outlined"
              value={portShippingForm}
              onChange={(e) => setPortShippingForm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              margin="dense"
              label="Comments:"
              type="text"
              fullWidth
              variant="outlined"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </Grid>
        </Grid>

        <TableContainer component={Paper} style={{ marginTop: "16px" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>Vendor#</TableCell>
                <TableCell>Order#</TableCell>
                <TableCell>Style#</TableCell>
                <TableCell>Sample Status</TableCell>
                <TableCell>Requested ETD</TableCell>
                <TableCell>Qty Ordered</TableCell>
                <TableCell>Qty / Carton</TableCell>
                <TableCell>Total Carton</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>CBM</TableCell>
                <TableCell>Weight (KG)</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vendorData?.map((row, index) => (
                <React.Fragment key={index}>
                  <TableRow>
                    <TableCell>
                      <Checkbox
                        checked={selectedItemDetails.includes(row._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItemDetails([
                              ...selectedItemDetails,
                              row._id,
                            ]);
                          } else {
                            setSelectedItemDetails(
                              selectedItemDetails.filter((id) => id !== row._id)
                            );
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleExpandClick(index)}
                      >
                        {expandedRows[index] ? <Remove /> : <Add />}
                      </IconButton>
                    </TableCell>
                    <TableCell>{row?.workOrder_Id?.workOrderId}</TableCell>
                    <TableCell>{row.order}</TableCell>
                    <TableCell>{row?.style_number}</TableCell>
                    <TableCell>{row.sampleStatus}</TableCell>
                    <TableCell>
                      {new Date(row?.workOrder_Id?.etd).toLocaleDateString(
                        "en-CA"
                      )}
                    </TableCell>
                    <TableCell>
                      {row.quantity}{" "}
                      <IconButton
                        size="small"
                        onClick={() => handleEditClick(index, row)}
                      >
                        <Edit size={16} />
                      </IconButton>
                    </TableCell>
                    <TableCell>{row.qtyPerCarton}</TableCell>
                    <TableCell>{row.totalCarton}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{row.cbm_per_unit}</TableCell>
                    <TableCell>{row.weight}</TableCell>
                  </TableRow>

                  {expandedRows[index] && (
                    <TableRow style={{ background: "#fdeec7" }}>
                      <TableCell colSpan={12}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Loading Date</TableCell>
                              <TableCell>Vessel ETD</TableCell>
                              <TableCell>Comments</TableCell>
                              <TableCell>Quantity</TableCell>
                              <TableCell>Total Carton</TableCell>
                              <TableCell>Status</TableCell>
                              <TableCell>CBM</TableCell>
                              <TableCell>Weight (KG)</TableCell>
                              <TableCell>Action</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell>
                                <TextField
                                  type="number"
                                  value={editableRowData.quantity}
                                  onChange={(e) =>
                                    setEditableRowData({
                                      ...editableRowData,
                                      quantity: e.target.value,
                                    })
                                  }
                                />
                              </TableCell>
                              <TableCell>{row.totalCarton}</TableCell>
                              <TableCell>{row.status}</TableCell>
                              <TableCell>
                                <TextField
                                  type="number"
                                  value={editableRowData.cbm_per_unit}
                                  onChange={(e) =>
                                    setEditableRowData({
                                      ...editableRowData,
                                      cbm_per_unit: e.target.value,
                                    })
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  type="number"
                                  value={editableRowData.weight}
                                  onChange={(e) =>
                                    setEditableRowData({
                                      ...editableRowData,
                                      weight: e.target.value,
                                    })
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                {/* <Button
                                  // onClick={() => handleSaveClick(index)}
                                  color="primary"
                                  size="small"
                                >
                                  Save
                                </Button> */}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSaveClick} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ASNDialog;
