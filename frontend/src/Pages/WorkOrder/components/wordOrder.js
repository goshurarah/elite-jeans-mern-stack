import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Box,
  Pagination,
} from "@mui/material";
import { getAllWorkOrder } from "../../../ApiServices/wordOrder";
import AddWorkOrder from "../../TechPack/Modals/WorkOrder/addWorkOrder";
import Navbar from "../../../Navbar/Navbar";

const WorkOrder = () => {
  const [techPacks, setTechPacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // Fetch tech packs with useCallback to prevent re-creation of the function on every render
  const fetchTechPacks = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const data = await getAllWorkOrder(page); // Pass the page number to the API
      setTechPacks(data.data);
      setTotalPages(data.pagination.totalPages); // Set total pages from API response
    } catch (error) {
      console.error("Failed to fetch tech packs:", error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch data when the component mounts or when the page changes
  useEffect(() => {
    fetchTechPacks(currentPage);
  }, [currentPage, fetchTechPacks]);

  // Open and close modal functions
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  // Handle navigate on work order click
  const handleClick = (techPackId) => {
    navigate(`/work-order-detail/${techPackId}`);
    console.log("handleClick")
  };

  // Handle repeat order function
  const handleRepeat = async (techPackId) => {
    try {
      await axios.post(`/api/work-orders/repeat-workorder/${techPackId}`);
      fetchTechPacks(currentPage); // Refetch data after repeating the order
    } catch (error) {
      console.error("Error posting tech pack:", error);
    }
  };

  // Handle page change
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Navbar />
      <Box sx={{ p: 2 }}>
        <Box display="flex" justifyContent="flex-start" mb={2}>
          <Button variant="contained" color="primary" onClick={openModal}>
            Add Work Order
          </Button>
        </Box>
        <AddWorkOrder
          isOpen={modalIsOpen}
          closeModal={closeModal}
          onSubmit={() => fetchTechPacks(currentPage)} // Refetch after adding a new work order
        />
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            boxShadow: 3,
            overflow: "hidden",
          }}
        >
          <Table sx={{ minWidth: 650, borderCollapse: "collapse" }}>
            <TableHead>
              <TableRow>
                {["Order#", "Style#", "Customer PO#", "Sample Status", "Vendor", "Shipping Status", "Date Created", "ETD", "Actions"].map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "#f4f6f8",
                      color: "#5c6bc0",
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <CircularProgress size={24} sx={{ color: "#5c6bc0" }} />
                  </TableCell>
                </TableRow>
              ) : techPacks?.length > 0 ? (
                techPacks.map((row) => (
                  <TableRow
                    key={row?._id}
                    sx={{
                      "&:hover": { backgroundColor: "#f5f5f5" },
                      transition: "background-color 0.3s ease",
                    }}
                  >
                    <TableCell>{row?.workOrderId}</TableCell>
                    <TableCell>{row?.styleId}</TableCell>
                    <TableCell>{row?.customerPo}</TableCell>
                    <TableCell>{row?.sampleStatus}</TableCell>
                    <TableCell>{row?.vendor?.name}</TableCell>
                    <TableCell>{row?.shippingStatus}</TableCell>
                    <TableCell>{new Date(row?.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(row?.etd).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          sx={{
                            textTransform: "none",
                            fontWeight: 500,
                            "&:hover": { backgroundColor: "#e3f2fd" },
                          }}
                          onClick={() => handleClick(row?._id)}
                        >
                          View
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          sx={{
                            textTransform: "none",
                            fontWeight: 500,
                            "&:hover": { backgroundColor: "#ffcdd2" },
                          }}
                          onClick={() => handleRepeat(row?._id)}
                        >
                          Repeat Order
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    align="center"
                    sx={{ fontStyle: "italic", color: "#757575" }}
                  >
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination Controls */}
        <Box display="flex" justifyContent="end" mt={3}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      </Box>
    </>
  );
};

export default WorkOrder;