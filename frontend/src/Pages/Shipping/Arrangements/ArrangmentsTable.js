// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   IconButton,
//   Typography,
//   Chip,
//   Select,
//   MenuItem,
//   TextField,
//   Checkbox,
//   FormControlLabel,
//   CircularProgress,
//   Button,
//   Tooltip,
// } from "@mui/material";
// import {
//   Add as AddIcon,
//   FileDownload as FileDownloadIcon,
// } from "@mui/icons-material";
// import axios from "axios";
// import "./ArrangmentTable.css";
// import Navbar from "../../../Navbar/Navbar";

// function ArrangementTable() {
//   const [selectedVendor, setSelectedVendor] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [vendors, setVendors] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const fetchVendors = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get("/api/vendors");
//       setVendors(response.data);
//     } catch (error) {
//       console.error("Error fetching vendors:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchVendors();
//   }, []);
//   const [filters, setFilters] = useState({
//     arranged: true,
//     inTransit: true,
//     received: false,
//   });
//   const handleVendorChange = (e) => {
//     setSelectedVendor(e.target.value);
//   };
//   const [expandedRows, setExpandedRows] = useState({});

//   const handleExpandRow = (id) => {
//     setExpandedRows((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };

//   const getStatusChip = (status) => {
//     const colors = {
//       Arranged: "info",
//       "In Transit": "primary",
//       Received: "success",
//     };

//     return <Chip label={status} color={colors[status]} size="small" />;
//   };

//   const arrangements = [
//     {
//       id: "628",
//       shipDate: "01/21/2025",
//       arrivalDate: "02/08/2025",
//       status: "In Transit",
//       bookingNumber: "LDP, Container#: OOCU9513915",
//       items: [],
//     },
//     {
//       id: "628",
//       shipDate: "01/21/2025",
//       arrivalDate: "02/08/2025",
//       status: "In Transit",
//       bookingNumber: "LDP, Container#: OOCU9513915",
//       items: [],
//     },
//   ];

//   return (
//     <>
//       <Navbar />
//       <Box sx={{ p: 3 }}>
//         <Paper elevation={2}>
//           <Box>
//             <Typography variant="h6" sx={{ background: "#d2f1ff", pl: 2 }}>
//               Arrangements
//             </Typography>

//             <Box
//               sx={{
//                 display: "flex",
//                 gap: 2,
//                 alignItems: "center",
//                 background: "#d2f1ff",
//                 pl: 2,
//               }}
//             >
//               <Select
//                 value={selectedVendor}
//                 onChange={handleVendorChange}
//                 label="Vendor"
//                 displayEmpty
//                 sx={{ minWidth: 150 }}
//               >
//                 {loading ? (
//                   <MenuItem disabled>
//                     <CircularProgress size={24} />
//                   </MenuItem>
//                 ) : (
//                   vendors.map((vendor) => (
//                     <MenuItem key={vendor._id} value={vendor._id}>
//                       {vendor.name}
//                     </MenuItem>
//                   ))
//                 )}
//               </Select>

//               <TextField
//                 placeholder="Search..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 size="small"
//               />

//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={filters.arranged}
//                     onChange={(e) =>
//                       setFilters((prev) => ({
//                         ...prev,
//                         arranged: e.target.checked,
//                       }))
//                     }
//                   />
//                 }
//                 label="Arranged"
//               />
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={filters.inTransit}
//                     onChange={(e) =>
//                       setFilters((prev) => ({
//                         ...prev,
//                         inTransit: e.target.checked,
//                       }))
//                     }
//                   />
//                 }
//                 label="In Transit"
//               />
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={filters.received}
//                     onChange={(e) =>
//                       setFilters((prev) => ({
//                         ...prev,
//                         received: e.target.checked,
//                       }))
//                     }
//                   />
//                 }
//                 label="Received"
//               />
//             </Box>

//             <TableContainer
//               sx={{
//                 maxHeight: 600,
//                 position: "relative",
//               }}
//               className="table_container_arrangmenttable"
//             >
//               <Table sx={{ minWidth: 650 }}>
//                 <TableHead
//                   sx={{
//                     position: "sticky",
//                     top: 0,
//                     zIndex: 1,
//                     background: "#d2f1ff",
//                   }}
//                 >
//                   <TableRow>
//                     <TableCell padding="checkbox" />
//                     <TableCell>Arrangement #</TableCell>
//                     <TableCell>Ship Date</TableCell>
//                     <TableCell>Arrival Date</TableCell>
//                     <TableCell>Status</TableCell>
//                     <TableCell>Booking Number</TableCell>
//                     <TableCell align="center">Actions</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {arrangements.map((arrangement) => (
//                     <React.Fragment key={arrangement.id}>
//                       <TableRow>
//                         <TableCell padding="checkbox">
//                           <IconButton
//                             size="small"
//                             onClick={() => handleExpandRow(arrangement.id)}
//                             className="red-button"
//                           >
//                             {expandedRows[arrangement.id] ? "-" : "+"}
//                           </IconButton>
//                         </TableCell>
//                         <TableCell>{arrangement.id}</TableCell>
//                         <TableCell>{arrangement.shipDate}</TableCell>
//                         <TableCell>{arrangement.arrivalDate}</TableCell>
//                         <TableCell>
//                           {getStatusChip(arrangement.status)}
//                         </TableCell>
//                         <TableCell>{arrangement.bookingNumber}</TableCell>
//                         <TableCell align="center">
//                           <Tooltip title="Download PDF" arrow>
//                             <Button
//                               startIcon={<FileDownloadIcon />}
//                               variant="contained"
//                               color="warning"
//                               size="small"
//                               sx={{ mr: 1 }}
//                             />
//                           </Tooltip>
//                           <Tooltip title="Download PDF with Price" arrow>
//                             <Button
//                               startIcon={<FileDownloadIcon />}
//                               variant="contained"
//                               size="small"
//                             />
//                           </Tooltip>
//                         </TableCell>
//                       </TableRow>
//                       {expandedRows[arrangement.id] && (
//                         <TableRow>
//                           <TableCell colSpan={7}>
//                             {/* Nested table for arrangement items */}
//                             <Table size="small">
//                               <TableHead sx={{ background: "#f1e0f3" }}>
//                                 <TableRow>
//                                   <TableCell>ASN #</TableCell>
//                                   <TableCell>Contract #</TableCell>
//                                   <TableCell>Order #</TableCell>
//                                   <TableCell>Vendor</TableCell>
//                                   <TableCell>Style #</TableCell>
//                                 </TableRow>
//                               </TableHead>
//                               <TableBody>
//                                 {/* Add arrangement items here */}
//                               </TableBody>
//                             </Table>
//                           </TableCell>
//                         </TableRow>
//                       )}
//                     </React.Fragment>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>

//             {/* Footer */}
//             <Box
//   sx={{
//     position: "sticky",
//     bottom: 0,
//     zIndex: 1,
//     mt: 2,
//     p: 2,
//     borderTop: 1,
//     borderColor: "divider",
//     background: "#d2f1ff",
//   }}
// >
//   <Box
//     sx={{
//       display: "grid",
//       gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
//       gap: 4,
//       alignItems: "center", // Aligns content vertically
//       height: "auto",
//     }}
//   >
//     <Typography variant="subtitle2">
//       Totals (Arranged / In Transit)
//     </Typography>
//     <Typography variant="body2">Qty Ordered: 136,054</Typography>
//     <Typography variant="body2">Shipping Qty: 132,785</Typography>
//     <Typography variant="body2">CBM: 227.19160</Typography>
//     <Typography variant="body2">Master Pack Qty: 4,328</Typography>
//   </Box>

//   <Box
//     sx={{
//       display: "grid",
//       gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", // Same grid layout
//       gap: 4,
//       alignItems: "center",
//       height: "auto",
//       borderTop: 1,
//       borderColor: "divider",
//     }}
//   >
//     <Typography variant="subtitle2" gutterBottom>
//       Totals (Ready to Ship)
//     </Typography>
//     <Typography variant="body2">Qty Ordered: 136,054</Typography>
//     <Typography variant="body2">Qty Ready to Ship: 132,785</Typography>
//     <Typography variant="body2">CBM: 227.19160</Typography>
//     <Typography variant="body2">Master Pack Qty: 4,328</Typography>
//   </Box>

//   <Box
//     sx={{
//       display: "grid",
//       gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", // Same grid layout
//       gap: 4,
//       alignItems: "center",
//       height: "auto",
//       borderTop: 1,
//       borderColor: "divider",
//     }}
//   >
//     <Typography variant="subtitle2" gutterBottom>
//       Totals (Open)
//     </Typography>
//     <Typography variant="body2">Qty Ordered: 136,054</Typography>
//     <Typography variant="body2">Qty Open: 132,785</Typography>
//     <Typography variant="body2">CBM: 227.19160</Typography>
//     <Typography variant="body2">Master Pack Qty: 4,328</Typography>
//   </Box>
// </Box>

//           </Box>
//         </Paper>
//       </Box>
//     </>
//   );
// }

// export default ArrangementTable;

import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Chip,
  Select,
  MenuItem,
  TextField,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Button,
  Tooltip,
} from "@mui/material";
import {
  Add as AddIcon,
  FileDownload as FileDownloadIcon,
} from "@mui/icons-material";
import axios from "axios";
import "./ArrangmentTable.css";
import Navbar from "../../../Navbar/Navbar";

function ArrangementTable() {
  const [selectedVendor, setSelectedVendor] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [arrangements, setArrangements] = useState([]); // State to store arrangements data
  const [filters, setFilters] = useState({
    arranged: true,
    inTransit: true,
    received: false,
  });
  const [expandedRows, setExpandedRows] = useState({});

  // Fetch vendors
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

  // Fetch arrangements based on selected vendor
  const fetchArrangements = async (vendorId) => {
    if (!vendorId) return; // Don't fetch if no vendor is selected
    setLoading(true);
    try {
      const response = await axios.get(`/api/arrangements/vendor/${vendorId}`);
      setArrangements(response.data.data || []); // Set to empty array if no data
    } catch (error) {
      console.error("Error fetching arrangements:", error);
      setArrangements([]); // Reset arrangements on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch vendors on component mount
  useEffect(() => {
    fetchVendors();
  }, []);

  // Fetch arrangements when selected vendor changes
  useEffect(() => {
    if (selectedVendor) {
      fetchArrangements(selectedVendor);
    } else {
      setArrangements([]); // Clear arrangements if no vendor is selected
    }
  }, [selectedVendor]);

  const handleVendorChange = (e) => {
    setSelectedVendor(e.target.value);
    setExpandedRows({}); // Reset expanded rows when vendor changes
  };

  const handleExpandRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getStatusChip = (status) => {
    const colors = {
      Arranged: "info",
      "In Transit": "primary",
      Received: "success",
      "Not Yet Shipped": "warning", // Added new status
      "Ready to Ship": "secondary", // Added new status
    };

    return <Chip label={status} color={colors[status]} size="small" />;
  };

  // Calculate sums for footer
  const calculateTotals = () => {
    let qtyOrdered = 0;
    let shippingQty = 0;
    let totalCBM = 0;
    let masterPackQty = 0;

    arrangements.forEach((arrangement) => {
      arrangement.selectedASN.forEach((asn) => {
        asn.selectedItemDetails.forEach((item) => {
          qtyOrdered += item.quantity;
          shippingQty += item.quantity; // Assuming "Shipping Qty" = Quantity ordered for now
          totalCBM += item.total_cbm;
          masterPackQty += item.number_of_master_polybags_per_master_carton;
        });
      });
    });

    return { qtyOrdered, shippingQty, totalCBM, masterPackQty };
  };

  const totals = calculateTotals();

  return (
    <>
      <Navbar />
      <Box sx={{ p: 3 }}>
        <Paper elevation={2}>
          <Box>
            <Typography variant="h6" sx={{ background: "#d2f1ff", pl: 2 }}>
              Arrangements
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                background: "#d2f1ff",
                pl: 2,
              }}
            >
              <Select
                value={selectedVendor}
                onChange={handleVendorChange}
                label="Vendor"
                displayEmpty
                sx={{ minWidth: 150 }}
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

              <TextField
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.arranged}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        arranged: e.target.checked,
                      }))
                    }
                  />
                }
                label="Arranged"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.inTransit}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        inTransit: e.target.checked,
                      }))
                    }
                  />
                }
                label="In Transit"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.received}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        received: e.target.checked,
                      }))
                    }
                  />
                }
                label="Received"
              />
            </Box>

            <TableContainer
              sx={{
                maxHeight: 600,
                position: "relative",
              }}
              className="table_container_arrangmenttable"
            >
              <Table sx={{ minWidth: 650 }}>
                <TableHead
                  sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                    background: "#d2f1ff",
                  }}
                >
                  <TableRow>
                    <TableCell padding="checkbox" />
                    <TableCell>Arrangement #</TableCell>
                    <TableCell>Ship Date</TableCell>
                    <TableCell>Arrival Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Destination</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {arrangements.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No Data Available
                      </TableCell>
                    </TableRow>
                  ) : (
                    arrangements?.map((arrangement) => (
                      <React.Fragment key={arrangement?._id}>
                        <TableRow>
                          <TableCell padding="checkbox">
                            <IconButton
                              size="small"
                              onClick={() => handleExpandRow(arrangement?._id)}
                              className="red-button"
                            >
                              {expandedRows[arrangement?._id] ? "-" : "+"}
                            </IconButton>
                          </TableCell>
                          <TableCell>
                            {arrangement?.arrangementNumber}
                          </TableCell>
                          <TableCell>
                            {new Date(
                              arrangement?.shipDate
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {new Date(
                              arrangement?.arrivalDate
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {getStatusChip(arrangement?.shippingStatus)}
                          </TableCell>
                          <TableCell>{arrangement?.destination}</TableCell>
                          <TableCell align="center">
                            <Tooltip title="Download PDF" arrow>
                              <Button
                                startIcon={<FileDownloadIcon />}
                                variant="contained"
                                color="warning"
                                size="small"
                                sx={{ mr: 1 }}
                              />
                            </Tooltip>
                            <Tooltip title="Download PDF with Price" arrow>
                              <Button
                                startIcon={<FileDownloadIcon />}
                                variant="contained"
                                size="small"
                              />
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                        {expandedRows[arrangement._id] && (
                          <TableRow>
                            <TableCell colSpan={7}>
                              {/* Nested table for selectedASN */}
                              <Table size="small">
                                <TableHead sx={{ background: "#f1e0f3" }}>
                                  <TableRow>
                                    <TableCell>ASN #</TableCell>
                                    <TableCell>Loading Date</TableCell>
                                    <TableCell>Vessel ETD</TableCell>
                                    <TableCell>Vendor</TableCell>
                                    <TableCell>Status</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {arrangement?.selectedASN?.map((asn) => (
                                    <TableRow key={asn?._id}>
                                      <TableCell>{asn?.asnNumber}</TableCell>
                                      <TableCell>
                                        {new Date(
                                          asn?.loadingDate
                                        ).toLocaleDateString()}
                                      </TableCell>
                                      <TableCell>
                                        {new Date(
                                          asn?.vesselETD
                                        ).toLocaleDateString()}
                                      </TableCell>
                                      <TableCell>{asn?.vendor?.name}</TableCell>
                                      <TableCell>{asn?.status}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Footer */}
            <Box
              sx={{
                position: "sticky",
                bottom: 0,
                zIndex: 1,
                mt: 2,
                p: 2,
                borderTop: 1,
                borderColor: "divider",
                background: "#d2f1ff",
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
                  gap: 4,
                  alignItems: "center",
                  height: "auto",
                }}
              >
                <Typography variant="subtitle2">
                  Totals (Arranged / In Transit)
                </Typography>
                <Typography variant="body2">
                  Qty Ordered: {totals.qtyOrdered}
                </Typography>
                <Typography variant="body2">
                  Shipping Qty: {totals.shippingQty}
                </Typography>
                <Typography variant="body2">CBM: {totals.totalCBM}</Typography>
                <Typography variant="body2">
                  Master Pack Qty: {totals.masterPackQty}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
                  gap: 4,
                  alignItems: "center",
                  height: "auto",
                  borderTop: 1,
                  borderColor: "divider",
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Totals (Ready to Ship)
                </Typography>
                <Typography variant="body2">
                  Qty Ordered: {totals.qtyOrdered}
                </Typography>
                <Typography variant="body2">
                  Qty Ready to Ship: {totals.shippingQty}
                </Typography>
                <Typography variant="body2">CBM: {totals.totalCBM}</Typography>
                <Typography variant="body2">
                  Master Pack Qty: {totals.masterPackQty}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
                  gap: 4,
                  alignItems: "center",
                  height: "auto",
                  borderTop: 1,
                  borderColor: "divider",
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Totals (Open)
                </Typography>
                <Typography variant="body2">
                  Qty Ordered: {totals.qtyOrdered}
                </Typography>
                <Typography variant="body2">
                  Qty Open: {totals.shippingQty}
                </Typography>
                <Typography variant="body2">CBM: {totals.totalCBM}</Typography>
                <Typography variant="body2">
                  Master Pack Qty: {totals.masterPackQty}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
}

export default ArrangementTable;
