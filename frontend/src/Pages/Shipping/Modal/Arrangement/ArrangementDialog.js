import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Button,
  TextField,
  IconButton,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar, Alert 
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

function ArrangementDialog({ open, onClose }) {
  const [vendors, setVendors] = useState([]);
  const [asns, setAsns] = useState([]);
  const [totalCarton, setTotalCarton] = useState(0);
  const [arrangementNumber, setArrangementNumber] = useState("");
  const [shipDate, setShipDate] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [destination, setDestination] = useState("");
  const [shippingStatus, setShippingStatus] = useState("Not Yet Shipped");
  const [errorMessage, setErrorMessage] = useState("");

  // Handle form submission
  const handleSubmit = async () => {
    
    const selectedASN = asns.filter((asn) => asn.checked).map((asn) => asn.id);
  
    const postData = {
      arrangementNumber: Number(arrangementNumber),
      shipDate,
      arrivalDate,
      destination,
      shippingStatus,
      selectedASN,
    };
  
    try {
      const response = await axios.post("/api/arrangements/", postData);
      console.log("Success:", response.data);
      onClose();
      setErrorMessage(""); // Clear any previous errors
    } catch (error) {
      console.error("Error posting data:", error);
      // Set error message based on error type
      if (error.response) {
        // Server responded with an error (status other than 2xx)
        setErrorMessage(error.response.data.error || "Something went wrong!");
      } else if (error.request) {
        // No response received
        setErrorMessage("No response received from the server.");
      } else {
        // Other errors
        setErrorMessage(error.message);
      }
    }
  };
  

  const [totalCBM, setTotalCBM] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);

  const toggleASNExpanded = (asn) => {
    setAsns((prevAsns) =>
      prevAsns.map((a) =>
        a.id === asn.id ? { ...a, expanded: !a.expanded } : a
      )
    );
  };

  const toggleASNChecked = (asn) => {
    const isChecked = !asn.checked;
    setAsns((prevAsns) =>
      prevAsns.map((a) =>
        a.id === asn.id
          ? {
              ...a,
              checked: isChecked,
              items: a.items.map((item) => ({ ...item, checked: isChecked })),
            }
          : a
      )
    );
  };

  const toggleItemChecked = (asn, itemId) => {
    setAsns((prevAsns) =>
      prevAsns.map((a) =>
        a.id === asn.id
          ? {
              ...a,
              items: a.items.map((item) =>
                item.id === itemId ? { ...item, checked: !item.checked } : item
              ),
              checked: a.items.every((item) =>
                item.id === itemId ? !item.checked : item.checked
              ),
            }
          : a
      )
    );
  };

  const fetchASN = async () => {
    try {
      const response = await axios.get("/api/asn/get");
      const data = response.data.data;

      const transformedAsns = data.map((asn) => ({
        id: asn._id,
        asnNumber: asn.asnNumber,
        vendorNumber: asn.vendor.name,
        createdDate: new Date(asn.createdDate).toLocaleDateString(),
        loadingDate: new Date(asn.loadingDate).toLocaleDateString(),
        vesselETD: new Date(asn.vesselETD).toLocaleDateString(),
        items: asn.selectedItemDetails.map((item) => ({
          id: item._id,
          orderNumber: item.customer_po_number,
          styleNumber: item.style_number,
          sampleStatus: {
            design: "Design Approved with Corrections on 08/16/2021",
            fit: "Fit Approved with Corrections on 08/16/2021",
          },
          requestedETD: new Date(asn.vesselETD).toLocaleDateString(),
          quantity: item.quantity,
          totalCarton: item.number_of_pieces_per_master_carton,
          status: asn.status,
          cbm: item.total_cbm,
          weight: 0.0,
          checked: false,
        })),
        expanded: false,
        checked: false,
      }));

      setAsns(transformedAsns);

      const uniqueVendors = [...new Set(data.map((asn) => asn.vendor.name))];
      setVendors(uniqueVendors);
    } catch (error) {
      console.error("Error fetching ASN data:", error);
    }
  };

  useEffect(() => {
    fetchASN();
  }, []);

  useEffect(() => {
    const carton = asns.reduce((acc, asn) => {
      return (
        acc +
        asn.items.reduce(
          (acc, item) => acc + (item.checked ? item.totalCarton : 0),
          0
        )
      );
    }, 0);
    setTotalCarton(carton);

    const cbm = asns.reduce((acc, asn) => {
      return (
        acc +
        asn.items.reduce((acc, item) => acc + (item.checked ? item.cbm : 0), 0)
      );
    }, 0);
    setTotalCBM(cbm);

    const weight = asns.reduce((acc, asn) => {
      return (
        acc +
        asn.items.reduce(
          (acc, item) => acc + (item.checked ? item.weight : 0),
          0
        )
      );
    }, 0);
    setTotalWeight(weight);
  }, [asns]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>New Arrangement</DialogTitle>
      <DialogContent>
        <div style={{ marginTop: "16px" }}>
          {/* First row */}
          <div style={{ display: "flex", gap: "16px" }}>
            <TextField
              label="Arrangement #:"
              size="small"
              fullWidth
              style={{ flexBasis: "16%" }}
              value={arrangementNumber}
              onChange={(e) => setArrangementNumber(e.target.value)}
            />
            <TextField
              label="Ship Date:"
              type="date"
              size="small"
              fullWidth
              style={{ flexBasis: "32%" }}
              value={shipDate}
              onChange={(e) => setShipDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Arrival Date (ETA):"
              type="date"
              size="small"
              fullWidth
              style={{ flexBasis: "48%" }}
              value={arrivalDate}
              onChange={(e) => setArrivalDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </div>

          {/* Second row */}
          <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
            <FormControl fullWidth style={{ flexBasis: "48%" }}>
              <InputLabel>Destination:</InputLabel>
              <Select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                size="small"
              >
                <MenuItem value="New York">New York</MenuItem>
                <MenuItem value="Los Angeles">Los Angeles</MenuItem>
                <MenuItem value="China">China</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* Third row */}
          <div style={{ marginTop: "16px", marginBottom: "16px" }}>
            <FormControl sx={{ width: "50%" }}>
              <InputLabel>Shipping Status:</InputLabel>
              <Select
                value={shippingStatus}
                onChange={(e) => setShippingStatus(e.target.value)}
                size="small"
              >
                <MenuItem value="Not Yet Shipped">Not Yet Shipped</MenuItem>
                <MenuItem value="In Transit">In Transit</MenuItem>
                <MenuItem value="Received">Received</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <div
          style={{
            maxHeight: "400px",
            overflowY: "auto",
            position: "relative",
          }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: "#d7f5be !important" }}>
              <TableRow style={{ background: "transparent" }}>
                <TableCell colSpan={9} style={{ background: "transparent" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "16px",
                    }}
                  >
                    <TextField
                      placeholder="Search..."
                      variant="outlined"
                      size="small"
                      style={{ marginRight: "16px" }}
                    />
                    <div>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Add />}
                        onClick={() =>
                          setAsns((prev) =>
                            prev.map((a) => ({ ...a, expanded: true }))
                          )
                        }
                      >
                        Show Items
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Remove />}
                        onClick={() =>
                          setAsns((prev) =>
                            prev.map((a) => ({ ...a, expanded: false }))
                          )
                        }
                        style={{ marginLeft: "8px" }}
                      >
                        Hide Items
                      </Button>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow style={{ background: "transparent" }}>
                <TableCell
                  padding="checkbox"
                  style={{ background: "transparent" }}
                ></TableCell>
                <TableCell style={{ background: "transparent" }}></TableCell>
                <TableCell align="right" style={{ background: "transparent" }}>
                  ASN #
                </TableCell>
                <TableCell align="center" style={{ background: "transparent" }}>
                  Vendor #
                </TableCell>
                <TableCell align="center" style={{ background: "transparent" }}>
                  Created Date
                </TableCell>
                <TableCell align="center" style={{ background: "transparent" }}>
                  Loading Date
                </TableCell>
                <TableCell align="center" style={{ background: "transparent" }}>
                  Vessel ETD
                </TableCell>
                <TableCell align="center" style={{ background: "transparent" }}>
                  Items
                </TableCell>
                <TableCell style={{ background: "transparent" }}>
                  Comments
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {asns.map((asn) => (
                <React.Fragment key={asn.id}>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={asn.checked || false}
                        onChange={() => toggleASNChecked(asn)}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => toggleASNExpanded(asn)}
                      >
                        {asn.expanded ? <Remove /> : <Add />}
                      </IconButton>
                    </TableCell>
                    <TableCell align="right">{asn.asnNumber}</TableCell>
                    <TableCell align="center">{asn.vendorNumber}</TableCell>
                    <TableCell align="center">{asn.createdDate}</TableCell>
                    <TableCell align="center">{asn.loadingDate}</TableCell>
                    <TableCell align="center">{asn.vesselETD}</TableCell>
                    <TableCell align="center">{asn.items.length}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  {asn.expanded && (
                    <TableRow>
                      <TableCell colSpan={9}>
                        <Table>
                          <TableHead style={{ background: "#fdeec7" }}>
                            <TableRow>
                              <TableCell padding="checkbox"></TableCell>
                              <TableCell>Order #</TableCell>
                              <TableCell>Style #</TableCell>
                              <TableCell>Sample Status</TableCell>
                              <TableCell>Requested ETD</TableCell>
                              <TableCell align="right">Quantity</TableCell>
                              <TableCell align="right">Total Carton</TableCell>
                              <TableCell>Status</TableCell>
                              <TableCell align="right">CBM</TableCell>
                              <TableCell align="right">Weight (KG)</TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody style={{ background: "#fffaec" }}>
                            {asn.items.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    checked={item.checked || false}
                                    onChange={() =>
                                      toggleItemChecked(asn, item.id)
                                    }
                                  />
                                </TableCell>
                                <TableCell>{item.orderNumber}</TableCell>
                                <TableCell>{item.styleNumber}</TableCell>
                                <TableCell>
                                  <Typography variant="body2">
                                    {item.sampleStatus.design}
                                  </Typography>
                                  <Typography variant="body2">
                                    {item.sampleStatus.fit}
                                  </Typography>
                                </TableCell>
                                <TableCell>{item.requestedETD}</TableCell>
                                <TableCell align="right">
                                  {item.quantity}
                                </TableCell>
                                <TableCell align="right">
                                  {item.totalCarton}
                                </TableCell>
                                <TableCell>{item.status}</TableCell>
                                <TableCell align="right">{item.cbm}</TableCell>
                                <TableCell align="right">
                                  {item.weight}
                                </TableCell>
                                <TableCell>
                                  <Button size="small" startIcon={<Add />}>
                                    Split
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
           {/* Display the error message if any */}
    
          {/* Fixed Footer */}
          <div
            style={{
              position: "sticky",
              bottom: 0,
              background: "#d7f5be",
              padding: "8px",
              display: "flex",
              justifyContent: "flex-end",
              borderTop: "1px solid #ccc",
            }}
          >
            <Typography variant="body2" style={{ marginRight: "16px" }}>
              Total Carton: {totalCarton.toFixed(3)}
            </Typography>
            <Typography variant="body2" style={{ marginRight: "16px" }}>
              Total CBM: {totalCBM.toFixed(3)}
            </Typography>
            <Typography variant="body2" style={{ marginRight: "16px" }}>
              Total Weight: {totalWeight.toFixed(3)} KG
            </Typography>
          </div>
        </div>
        {errorMessage && (
        <Typography
          variant="body2"
          color="error"
          style={{ marginTop: "16px", textAlign: "center" }}
        >
          {errorMessage}
        </Typography>
      )}
        <Button
          variant="contained"
          color="primary"
          style={{ marginLeft: "8px" }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onClose}
          style={{ marginLeft: "8px" }}
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default ArrangementDialog;
