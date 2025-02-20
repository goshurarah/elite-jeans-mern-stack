import React, { useState, useEffect } from "react";
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
  Typography,
  Box,
} from "@mui/material";
import AddModal from "./AddModal";
import { getAllTechPacks, deleteTechPack } from "../../ApiServices/apiService";
import Navbar from "../../Navbar/Navbar";

const AddTechPack = () => {
  const [techPacks, setTechPacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch tech packs when the component is mounted
  useEffect(() => {
    fetchTechPacks();
  }, []);
  const fetchTechPacks = async () => {
    try {
      const data = await getAllTechPacks();
      setTechPacks(data.data);
    } catch (error) {
      console.error("Failed to fetch tech packs:", error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const handlePostSubmit = (newTechPack) => {
    setTechPacks((prevTechPacks) => [...prevTechPacks, newTechPack]);
    fetchTechPacks();
  };
  useEffect(() => {
    handlePostSubmit();
  }, []);
  // const handlePostSubmit = (data) => {
  //   console.log('Data submitted:', data);
  // };

  const handleClick = (techPackId) => {
    navigate("/tech-pack-detail", { state: { techPackId } });
  };

  const handleDelete = async (techPackId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this tech pack?"
    );
    if (confirmDelete) {
      try {
        await deleteTechPack(techPackId);
        setTechPacks((prev) =>
          prev.filter((techPack) => techPack._id !== techPackId)
        );
      } catch (error) {
        console.error("Failed to delete tech pack:", error.message);
      }
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ p: 2 }}>
        {/* <Typography variant="h4" gutterBottom align="center">
        Tech Pack Management
      </Typography> */}

        <Box display="flex" justifyContent="flex-start" mb={2}>
          <Button variant="contained" color="primary" onClick={openModal}>
            Add Tech Pack
          </Button>
        </Box>

        <AddModal
          isOpen={modalIsOpen}
          closeModal={closeModal}
          onSubmit={handlePostSubmit}
        />

        <TableContainer
          component={Paper}
          sx={{ borderRadius: 2, boxShadow: 3, overflow: "hidden" }}
        >
          <Table sx={{ minWidth: 650, borderCollapse: "collapse" }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f4f6f8",
                    color: "#5c6bc0",
                  }}
                >
                  Pack ID
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f4f6f8",
                    color: "#5c6bc0",
                  }}
                >
                  Style
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f4f6f8",
                    color: "#5c6bc0",
                  }}
                >
                  Vendor
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f4f6f8",
                    color: "#5c6bc0",
                  }}
                >
                  Category
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f4f6f8",
                    color: "#5c6bc0",
                  }}
                >
                  Sub Category
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f4f6f8",
                    color: "#5c6bc0",
                  }}
                >
                  Item Type
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f4f6f8",
                    color: "#5c6bc0",
                  }}
                >
                  Date Created
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f4f6f8",
                    color: "#5c6bc0",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress size={24} sx={{ color: "#5c6bc0" }} />
                  </TableCell>
                </TableRow>
              ) : techPacks?.length > 0 ? (
                techPacks?.map((row) => (
                  <TableRow
                    key={row?._id}
                    sx={{
                      "&:hover": { backgroundColor: "#f5f5f5" },
                      transition: "background-color 0.3s ease",
                    }}
                  >
                    <TableCell>{row?.techPackId || "N/A"}</TableCell>
                    <TableCell>{row?.styleId || "N/A"}</TableCell>
                    <TableCell>{row?.vendor?.name || "N/A"}</TableCell>
                    <TableCell>{row?.category?.name || "N/A"}</TableCell>
                    <TableCell>{row?.subCategory?.name || "N/A"}</TableCell>
                    <TableCell>{row?.itemType?.name || "N/A"}</TableCell>
                    <TableCell>
                      {new Date(row?.lastUpdated).toLocaleDateString()}
                    </TableCell>
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
                          onClick={() => handleDelete(row._id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
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
      </Box>
    </>
  );
};

export default AddTechPack;
