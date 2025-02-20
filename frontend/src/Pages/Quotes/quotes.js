// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Grid,
//   Button,
//   Typography,
//   Table,
//   TableBody,
//   TableRow,
//   TableCell,
// } from "@mui/material";
// import {
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   TextField,
// } from "@mui/material";
// import Navbar from "../../Navbar/Navbar";
// import axios from "axios";
// import ViewQuoteModal from "./Modal/ViewQuoteModal";
// import AddPriceModal from "./Modal/AddPriceModal";
// import WorkOrder from "./WorkOrder";

// const Quote = () => {
//   const [vendorFilter, setVendorFilter] = useState("");
//   const [searchFilter, setSearchFilter] = useState("");
//   const [vendors, setVendors] = useState([]);
//   const [vendorData, setVendorData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedQuoteId, setSelectedQuoteId] = useState(null);
//   const [quoteData, setQuoteData] = useState(null);
//   const [isAddPriceModalOpen, setIsAddPriceModalOpen] = useState(false);
//   const [selectedTechPackId, setSelectedTechPackId] = useState(null);
//   const [quoteData1, setQuoteData1] = useState(null);
//   const [workOrderData, setWorkOrderData] = useState(null);

//   const openAddPriceModal = (techPackId) => {
//     setSelectedTechPackId(techPackId);
//     setIsAddPriceModalOpen(true);
//   };

//   const handleSubmitSent = () => {
//     // fetchQuoteData();
//   };

//   const closeAddPriceModal = () => {
//     setIsAddPriceModalOpen(false);
//   };

//   const openModal = (quoteId, vendorId) => {
//     setSelectedQuoteId(quoteId);
//     setIsModalOpen(true);
//     fetchQuoteData(quoteId);
//     setVendorData(vendorData);
//   };

//   const closeModal = () => setIsModalOpen(false);

//   const handleVendorChange = (event) => {
//     setVendorFilter(event.target.value);
//   };

//   const handleSearchChange = (event) => {
//     setSearchFilter(event.target.value);
//   };

//   const fetchQuoteData = (quoteId) => {
//     axios
//       .get(`/api/techPack/quote/${quoteId}`)
//       .then((response) => {
//         setQuoteData(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching quote data:", error);
//         setQuoteData(null);
//       });
//   };

//   useEffect(() => {
//     const fetchVendors = async () => {
//       try {
//         const response = await axios.get("/api/vendors");
//         const vendorNames = response.data;

//         setVendors(vendorNames);

//         if (vendorNames.length > 0) {
//           const firstVendorId = vendorNames[0]._id;
//           setVendorFilter(firstVendorId);
//           fetchVendorData(firstVendorId);
//         }
//       } catch (error) {
//         console.error("Error fetching vendors:", error);
//         setError("Error fetching vendors");
//       }
//     };

//     fetchVendors();
//   }, []);

//   const fetchVendorData = (vendorId) => {
//     setLoading(true);
//     setError(null);
//     axios
//       .get(`/api/techPack/vendor/${vendorId}`)
//       .then((response) => {
//         setVendorData(response.data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         setError("No data found");
//         setLoading(false);
//         console.error("Error fetching vendor data:", error);
//       });
//   };

//   const handleSelectChange = (event) => {
//     const vendorId = event.target.value;
//     setVendorFilter(vendorId);
//     fetchVendorData(vendorId);
//   };

//   // Function to format the date
//   function formatDate(dateString) {
//     if (!dateString) return "Invalid Date";

//     const date = new Date(dateString);
//     if (isNaN(date)) return "Invalid Date";

//     // Format the date as MM/DD/YYYY
//     const formattedDate = date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "2-digit",
//       day: "2-digit",
//     });

//     return formattedDate;
//   }

//   // Filter the vendor data based on searchFilter (techPackId)
//   const filteredVendorData = vendorData?.filter((item) =>
//     item?.techPackId?.toString().includes(searchFilter)
//   );

//   return (
//     <>
//       <Navbar />
//       <Box sx={{ padding: 2 }}>
//         <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//           <FormControl variant="outlined" style={{ minWidth: 150 }}>
//             <InputLabel id="vendor-select-label">Vendor</InputLabel>
//             <Select
//               labelId="vendor-select-label"
//               id="vendor-select"
//               value={vendorFilter}
//               onChange={handleSelectChange}
//               label="Vendor"
//             >
//               {vendors.map((vendor) => (
//                 <MenuItem key={vendor._id} value={vendor._id}>
//                   {vendor.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           {/* Search input */}
//           {/* <TextField
//             label="Search..."
//             variant="outlined"
//             value={searchFilter}
//             onChange={handleSearchChange}
//           /> */}
//         </Box>

//         {/* Show TechPack Data */}
// <h2>TechPack</h2>
//         <Grid container spacing={2}>
//           {loading ? (
//             // Loading state message for each grid card
//             <Grid item xs={12}>
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   height: "200px",
//                 }}
//               >
//                 <Typography variant="h6" color="textSecondary">
//                   Loading...
//                 </Typography>
//               </Box>
//             </Grid>
//           ) : error ? (
//             <Grid item xs={12}>
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   height: "200px",
//                 }}
//               >
//                 <Typography variant="h6" color="error">
//                   {error}
//                 </Typography>
//               </Box>
//             </Grid>
//           ) : filteredVendorData?.length === 0 ? (
//             // "No Data Found" message if there's no data
//             <Grid item xs={12}>
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   height: "200px",
//                 }}
//               >
//                 <Typography variant="h6" color="textSecondary">
//                   No Data Found
//                 </Typography>
//               </Box>
//             </Grid>
//           ) : (
//             // Show the filtered vendor data cards
//             filteredVendorData.map((item) => (
//               <Grid item xs={12} sm={12} md={12} lg={6} xl={4} key={item.id}>
//                 <Box
//                   sx={{
//                     display: {
//                       xs: "inline-grid",
//                       sm: "flex",
//                     },
//                     alignItems: "flex-start",
//                     backgroundColor: "#f9ffe6",
//                     borderRadius: 2,
//                     border: "1px solid #dcdcdc",
//                     overflow: "hidden",
//                     height: "100%",
//                   }}
//                 >
//                   {/* Left Image Section */}
//                   <Box
//                     component="img"
//                     src={item?.pictures[0]?.imageUrl}
//                     alt={item?.pictures[0]?.imageName}
//                     sx={{
//                       width: {
//                         xs: "100%",
//                         sm: 100,
//                       },
//                       height: "100%",
//                       objectFit: "cover",
//                       borderRight: "1px solid #dcdcdc",
//                     }}
//                   />

//                   {/* Right Content Section */}
//                   <Box sx={{ flex: 1, padding: 2 }}>
//                     <Typography
//                       variant="h6"
//                       sx={{
//                         fontSize: "1rem",
//                         fontWeight: 600,
//                         marginBottom: 1,
//                       }}
//                     >
//                       TechPack #{item?.techPackId}
//                     </Typography>
//                     <Typography variant="subtitle2" sx={{ marginBottom: 1 }}>
//                       {item.code}
//                     </Typography>

//                     {/* Table for Details */}
//                     <Table size="small" sx={{ marginBottom: 2 }}>
//                       <TableBody>
//                         <TableRow>
//                           <TableCell
//                             sx={{
//                               padding: "4px 8px",
//                               fontWeight: 600,
//                               border: "none",
//                             }}
//                           >
//                             Vendor
//                           </TableCell>
//                           <TableCell
//                             sx={{
//                               padding: "4px 8px",
//                               fontWeight: 600,
//                               border: "none",
//                             }}
//                           >
//                             Date
//                           </TableCell>
//                           <TableCell
//                             sx={{
//                               padding: "4px 8px",
//                               fontWeight: 600,
//                               border: "none",
//                             }}
//                           >
//                             Fabric
//                           </TableCell>
//                           <TableCell
//                             sx={{
//                               padding: "4px 8px",
//                               fontWeight: 600,
//                               border: "none",
//                             }}
//                           >
//                             Notes
//                           </TableCell>
//                           <TableCell
//                             sx={{
//                               padding: "4px 8px",
//                               fontWeight: 600,
//                               border: "none",
//                             }}
//                           >
//                             Price
//                           </TableCell>
//                         </TableRow>
//                         <TableRow>
//                           <TableCell
//                             sx={{ padding: "4px 8px", border: "none" }}
//                           >
//                             {item.vendor ? item.vendor.name : "N/A"}
//                           </TableCell>
//                           <TableCell
//                             sx={{ padding: "4px 8px", border: "none" }}
//                           >
//                             {/* {item.date} */}
//                             <span>
//                               {formatDate(
//                                 item?.tech_pack_quote[0]?.date || "N/A"
//                               )}
//                             </span>
//                           </TableCell>
//                           <TableCell
//                             sx={{ padding: "4px 8px", border: "none" }}
//                           >
//                             {item?.tech_pack_quote[0]?.fabric}
//                           </TableCell>
//                           <TableCell
//                             sx={{ padding: "4px 8px", border: "none" }}
//                           >
//                             {item?.tech_pack_quote[0]?.notes}
//                           </TableCell>
//                           <TableCell
//                             sx={{ padding: "4px 8px", border: "none" }}
//                           >
//                             {item?.tech_pack_quote[0]?.price}
//                           </TableCell>
//                         </TableRow>
//                       </TableBody>
//                     </Table>

//                     {/* Buttons */}
//                     <Box
//                       sx={{
//                         display: "flex",
//                         justifyContent: "flex-end",
//                         gap: 1,
//                       }}
//                     >
//                       <Button
//                         variant="contained"
//                         size="small"
//                         sx={{ textTransform: "none" }}
//                         onClick={() => openModal(item._id, vendorData)}
//                       >
//                         View Quote
//                       </Button>
//                       <Button
//                         variant="contained"
//                         size="small"
//                         color="secondary"
//                         sx={{ textTransform: "none" }}
//                         onClick={() => openAddPriceModal(item._id)}
//                       >
//                         Add Price
//                       </Button>
//                     </Box>
//                   </Box>
//                 </Box>
//               </Grid>
//             ))
//           )}
//         </Grid>
//         {/* Show WorkOrder Data */}
//         <h2>WorkOrder</h2>

//         <WorkOrder vendorData1={vendorData} vendorId={vendorFilter} />

//         <ViewQuoteModal
//           open={isModalOpen}
//           handleClose={closeModal}
//           quoteData={quoteData}
//           vendorId={vendorFilter}
//           setQuoteData={setQuoteData}
//           selectedQuoteId={selectedQuoteId}
//         />
//         <AddPriceModal
//           open={isAddPriceModalOpen}
//           handleClose={closeAddPriceModal}
//           techPackId={selectedTechPackId}
//           handleSubmitSent={handleSubmitSent}
//         />
//       </Box>
//     </>
//   );
// };

// export default Quote;
import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Button,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import axios from "axios";
import Navbar from "../../Navbar/Navbar";
import ViewQuoteModal from "./Modal/ViewQuoteModal";
import AddPriceModal from "./Modal/AddPriceModal";
import WorkOrder from "./WorkOrder";

const Quote = () => {
  const [vendorFilter, setVendorFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [vendors, setVendors] = useState([]);
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState(null);
  const [quoteData, setQuoteData] = useState(null);
  const [isAddPriceModalOpen, setIsAddPriceModalOpen] = useState(false);
  const [selectedTechPackId, setSelectedTechPackId] = useState(null);

  const openAddPriceModal = (techPackId) => {
    setSelectedTechPackId(techPackId);
    setIsAddPriceModalOpen(true);
  };

  const closeAddPriceModal = () => setIsAddPriceModalOpen(false);

  const openModal = (quoteId) => {
    setSelectedQuoteId(quoteId);
    setIsModalOpen(true);
    fetchQuoteData(quoteId);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleVendorChange = (event) => {
    const vendorId = event.target.value;
    setVendorFilter(vendorId);
    fetchVendorData(vendorId);
  };

  const handleSearchChange = (event) => setSearchFilter(event.target.value);

  const fetchQuoteData = async (quoteId) => {
    try {
      const response = await axios.get(`/api/techPack/quote/${quoteId}`);
      setQuoteData(response.data);
    } catch (error) {
      console.error("Error fetching quote data:", error);
      setQuoteData(null);
    }
  };

  const fetchVendors = async () => {
    try {
      const response = await axios.get("/api/vendors");
      const vendorNames = response.data;
      setVendors(vendorNames);

      if (vendorNames.length > 0) {
        const firstVendorId = vendorNames[0]._id;
        setVendorFilter(firstVendorId);
        fetchVendorData(firstVendorId);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setError("Error fetching vendors");
    }
  };

  const fetchVendorData = async (vendorId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/techPack/vendor/${vendorId}`);
      setVendorData(response.data);
    } catch (error) {
      console.error("Error fetching vendor data:", error);
      setError("No data found");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Invalid Date";
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const filteredVendorData = vendorData?.filter((item) =>
    item?.techPackId?.toString().includes(searchFilter)
  );

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <>
      <Navbar />
      <Box sx={{ padding: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <FormControl variant="outlined" style={{ minWidth: 150 }}>
            <InputLabel id="vendor-select-label">Vendor</InputLabel>
            <Select
              labelId="vendor-select-label"
              id="vendor-select"
              value={vendorFilter}
              onChange={handleVendorChange}
              label="Vendor"
            >
              {vendors.map((vendor) => (
                <MenuItem key={vendor._id} value={vendor._id}>
                  {vendor.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <h2>TechPack</h2>
        <Grid container spacing={2}>
          {loading ? (
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "200px",
                }}
              >
                <Typography variant="h6" color="textSecondary">
                  Loading...
                </Typography>
              </Box>
            </Grid>
          ) : error ? (
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "200px",
                }}
              >
                <Typography variant="h6" color="error">
                  {error}
                </Typography>
              </Box>
            </Grid>
          ) : filteredVendorData?.length === 0 ? (
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "200px",
                }}
              >
                <Typography variant="h6" color="textSecondary">
                  No Data Found
                </Typography>
              </Box>
            </Grid>
          ) : (
            filteredVendorData.map((item) => (
              <Grid item xs={12} sm={12} md={12} lg={6} xl={4} key={item.id}>
                <Box
                  sx={{
                    display: { xs: "inline-grid", sm: "flex" },
                    alignItems: "flex-start",
                    backgroundColor: "#f9ffe6",
                    borderRadius: 2,
                    border: "1px solid #dcdcdc",
                    overflow: "hidden",
                    height: "100%",
                  }}
                >
                  <Box
                    component="img"
                    src={item?.pictures[0]?.imageUrl}
                    alt={item?.pictures[0]?.imageName}
                    sx={{
                      width: { xs: "100%", sm: 100 },
                      height: "100%",
                      objectFit: "cover",
                      borderRight: "1px solid #dcdcdc",
                    }}
                  />
                  <Box sx={{ flex: 1, padding: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "1rem",
                        fontWeight: 600,
                        marginBottom: 1,
                      }}
                    >
                      TechPack #{item?.techPackId}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ marginBottom: 1 }}>
                      {item.code}
                    </Typography>
                    <Table size="small" sx={{ marginBottom: 2 }}>
                      <TableBody>
                        <TableRow>
                          <TableCell
                            sx={{
                              padding: "4px 8px",
                              fontWeight: 600,
                              border: "none",
                            }}
                          >
                            Vendor
                          </TableCell>
                          <TableCell
                            sx={{
                              padding: "4px 8px",
                              fontWeight: 600,
                              border: "none",
                            }}
                          >
                            Date
                          </TableCell>
                          <TableCell
                            sx={{
                              padding: "4px 8px",
                              fontWeight: 600,
                              border: "none",
                            }}
                          >
                            Fabric
                          </TableCell>
                          <TableCell
                            sx={{
                              padding: "4px 8px",
                              fontWeight: 600,
                              border: "none",
                            }}
                          >
                            Notes
                          </TableCell>
                          <TableCell
                            sx={{
                              padding: "4px 8px",
                              fontWeight: 600,
                              border: "none",
                            }}
                          >
                            Price
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{ padding: "4px 8px", border: "none" }}
                          >
                            {item.vendor?.name || "N/A"}
                          </TableCell>
                          <TableCell
                            sx={{ padding: "4px 8px", border: "none" }}
                          >
                            {formatDate(
                              item?.tech_pack_quote[0]?.date || "N/A"
                            )}
                          </TableCell>
                          <TableCell
                            sx={{ padding: "4px 8px", border: "none" }}
                          >
                            {item?.tech_pack_quote[0]?.fabric}
                          </TableCell>
                          <TableCell
                            sx={{ padding: "4px 8px", border: "none" }}
                          >
                            {item?.tech_pack_quote[0]?.notes}
                          </TableCell>
                          <TableCell
                            sx={{ padding: "4px 8px", border: "none" }}
                          >
                            {item?.tech_pack_quote[0]?.price}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1,
                      }}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ textTransform: "none" }}
                        onClick={() => openModal(item._id)}
                      >
                        View Quote
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="secondary"
                        sx={{ textTransform: "none" }}
                        onClick={() => openAddPriceModal(item._id)}
                      >
                        Add Price
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            ))
          )}
        </Grid>

        <h2>WorkOrder</h2>
        <WorkOrder vendorData1={vendorData} vendorId={vendorFilter} />

        <ViewQuoteModal
          open={isModalOpen}
          handleClose={closeModal}
          quoteData={quoteData}
          vendorId={vendorFilter}
          setQuoteData={setQuoteData}
          selectedQuoteId={selectedQuoteId}
        />
        <AddPriceModal
          open={isAddPriceModalOpen}
          handleClose={closeAddPriceModal}
          techPackId={selectedTechPackId}
          // handleSubmitSent={handleSubmitSent}
        />
      </Box>
    </>
  );
};

export default Quote;
