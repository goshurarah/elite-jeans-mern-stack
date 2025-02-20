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
  Box,
  Typography,
} from "@mui/material";
import AddSpecsModal from "../Modal/AddSpecsModal";
import Navbar from "../../../Navbar/Navbar";

// Static size range options
const Size_Range_Options = [
  { id: "1-0", label: "1-0" },
  { id: "1-19", label: "1-19" },
];

const getAllTechPacks = async () => {
  try {
    const response = await axios.get("/api/specsTemplates");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching tech packs:", error);
    throw error;
  }
};

const deleteTechPack = async (techPackId) => {
  try {
    await axios.delete(`/specs-template/${techPackId}`);
    return techPackId;
  } catch (error) {
    console.error("Error deleting tech pack:", error);
    throw error;
  }
};

const SpecsTemplate = () => {
  const [techPacks, setTechPacks] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();

  const fetchTechPacks = useCallback(async () => {
    try {
      const data = await getAllTechPacks();
      setTechPacks(data);
    } catch (error) {
      console.error("Failed to fetch tech packs:", error.message);
    }
  }, []);

  useEffect(() => {
    fetchTechPacks();
  }, [fetchTechPacks]);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handlePostSubmit = (data) => {
    fetchTechPacks();
  };

  const handleClick = (techPackId) => {
    navigate("/spec-template-detail", { state: { techPackId } });
  };

  // Handle Delete Tech Pack
  const handleDelete = async (techPackId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this tech pack?"
    );
    if (confirmDelete) {
      try {
        await deleteTechPack(techPackId);
        setTechPacks((prev) => prev.filter((techPack) => techPack._id !== techPackId));
      } catch (error) {
        console.error("Failed to delete tech pack:", error.message);
      }
    }
  };

  // Function to get the size range label based on ID
  const getSizeRangeLabel = (id) => {
    const sizeRange = Size_Range_Options.find((range) => range.id === id);
    return sizeRange ? sizeRange.label : "N/A"; // Return the label or N/A if not found
  };

  return (
    <>
      <Navbar />
      <div className="main_newScale">
        <Box my={3}>
          <Button variant="contained" color="primary" onClick={openModal}>
            Add New Template
          </Button>
        </Box>

        <AddSpecsModal
          isOpen={modalIsOpen}
          closeModal={closeModal}
          onSubmit={handlePostSubmit}
        />

        {/* Table to Display Tech Packs */}
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
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
                  Name
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f4f6f8",
                    color: "#5c6bc0",
                  }}
                >
                  Garment Type
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f4f6f8",
                    color: "#5c6bc0",
                  }}
                >
                  Size Range
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f4f6f8",
                    color: "#5c6bc0",
                  }}
                >
                  Point of Measure
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
              {techPacks?.length > 0 ? (
                techPacks.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>{row.Name || "N/A"}</TableCell>
                    <TableCell>{row.Garment_Type?.Garment_Type || "N/A"}</TableCell>
                    <TableCell>{getSizeRangeLabel(row.Size_Range) || "N/A"}</TableCell>
                    <TableCell>{row.Point_of_Measure || "N/A"}</TableCell>

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
                          onClick={() => handleClick(row._id)}
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
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No data available
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default SpecsTemplate;
