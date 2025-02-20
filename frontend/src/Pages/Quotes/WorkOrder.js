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
} from "@mui/material";
import axios from "axios";
import ViewQuoteModal from "./Modal/WorkOrder/ViewQuoteModal";
import AddPriceModal from "./Modal/WorkOrder/AddPriceModal";

const WorkOrder = ({ vendorId }) => {
  const [vendorFilter, setVendorFilter] = useState("");

  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState(null);
  const [quoteData, setQuoteData] = useState(null);
  const [isAddPriceModalOpen, setIsAddPriceModalOpen] = useState(false);
  const [selectedTechPackId, setSelectedTechPackId] = useState(null);
  const handleSubmitSent = () => {
    if (vendorFilter) {
      fetchVendorDataWorkOrder(vendorFilter);
    }
    setIsAddPriceModalOpen(false);
    setIsModalOpen(false);
  };
  useEffect(() => {
    if (vendorId) {
      setVendorFilter(vendorId); // Make sure vendorFilter is populated correctly
      fetchVendorDataWorkOrder(vendorId);
    }
  }, [vendorId]);

  const openAddPriceModal = (techPackId) => {
    setSelectedTechPackId(techPackId);
    setIsAddPriceModalOpen(true);
  };

  const closeAddPriceModal = () => {
    setIsAddPriceModalOpen(false);
    setIsModalOpen(false);
  };

  const openModal = (quoteId, vendorId) => {
    setSelectedQuoteId(quoteId);
    setIsModalOpen(true);
    fetchQuoteData(quoteId);
  };

  const closeModal = () => setIsModalOpen(false);

  const fetchQuoteData = (quoteId) => {
    axios
      .get(`/api/work-orders/quotes/${quoteId}`)
      .then((response) => {
        setQuoteData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching quote data:", error);
        setQuoteData(null);
      });
  };

  const fetchVendorDataWorkOrder = (vendorId) => {
    setLoading(true);
    setError(null);
    axios
      .get(`/api/work-orders/item-detail/Byvendor/${vendorId}`)
      .then((response) => {
        const { data } = response.data;
        setVendorData(data);

        setLoading(false);
      })
      .catch((error) => {
        setError("No data found");
        setLoading(false);
        console.error("Error fetching vendor data:", error);
      });
  };
  useEffect(() => {
    if (vendorId) {
      fetchVendorDataWorkOrder(vendorId);
    }
  }, [vendorId]);

  // Function to format the date
  function formatDate(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (isNaN(date)) return "";

    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    return formattedDate;
  }

  return (
    <>
      <Box>
        <Grid container spacing={2} mt={3}>
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
          ) : vendorData?.length === 0 ? (
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
                  No Work Orders Found
                </Typography>
              </Box>
            </Grid>
          ) : (
            vendorData?.map((workOrder) =>
              workOrder.itemDetails.map((item) => (
                <Grid item xs={12} sm={12} md={12} lg={6} xl={4} key={item._id}>
                  <Box
                    sx={{
                      display: {
                        xs: "inline-grid",
                        sm: "flex",
                      },
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
                      // {item?.work_order_quotes?.[0]?.vendor?.name ||
                      //   "N/A"}
                      src={item?.workOrder_Id?.pictures?.[0]?.imageUrl || "default-image-url"}
                      alt="Work Order Image"
                      sx={{
                        width: {
                          xs: "100%",
                          sm: 100,
                        },
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
                        Work Order #{item.workOrder_Id._id}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ marginBottom: 1 }}>
                        {/* Style #: {item.style_number} */}
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
                              {item?.work_order_quotes?.[0]?.vendor?.name ||
                                "N/A"}
                            </TableCell>
                            <TableCell
                              sx={{ padding: "4px 8px", border: "none" }}
                            >
                              {formatDate(item?.work_order_quotes?.[0]?.date)}
                            </TableCell>
                            <TableCell
                              sx={{ padding: "4px 8px", border: "none" }}
                            >
                              {item?.work_order_quotes?.[0]?.fabric || "N/A"}
                            </TableCell>
                            <TableCell
                              sx={{ padding: "4px 8px", border: "none" }}
                            >
                              {item?.work_order_quotes?.[0]?.notes || "N/A"}
                            </TableCell>
                            <TableCell
                              sx={{ padding: "4px 8px", border: "none" }}
                            >
                              {item?.work_order_quotes?.[0]?.price || "N/A"}
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
                          onClick={() => openModal(item._id, vendorFilter)}
                        >
                          View Work Order
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
            )
          )}
        </Grid>
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
          itemDetailId={selectedTechPackId}
          handleSubmitSent={handleSubmitSent}
        />
      </Box>
    </>
  );
};

export default WorkOrder;
