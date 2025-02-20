import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../../../../Navbar/Navbar";
import OpenPOMModal from "../../Modal/OpenPOMModal";

const SpecDetail = () => {
  const location = useLocation();
  const { techPackId } = location.state || {};
  const [data, setData] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [editedRowData, setEditedRowData] = useState({});
  const [originalRowData, setOriginalRowData] = useState({});
  const [dynamicKeys, setDynamicKeys] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `/api/specsTemplates/poms/${techPackId}`
      );
      const result = response.data.data;
      setData(result);

      if (result && result.length > 0) {
        const firstRow = result[0];
        setDynamicKeys(
          Object.keys(firstRow).filter(
            (key) =>
              key !== "_id" &&
              key !== "specTemplateId" &&
              key !== "createdAt" &&
              key !== "updatedAt" &&
              key !== "__v" && // Exclude __v
              key !== "code" &&
              key !== "description" &&
              key !== "tolerance"
          )
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [techPackId]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handlePayload = (payload) => {
    console.log("Received payload from modal:", payload);
    setTimeout(() => {
      fetchData();
    }, 1000);
  };

  const handleSelectAll = () => {
    const allIds = data?.map((row) => row._id);
    setSelectedIds(allIds);
  };

  const handleUnselectAll = () => {
    setSelectedIds([]);
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const handleDeleteSelected = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete the selected items?"
    );
    if (confirmDelete) {
      try {
        await Promise.all(
          selectedIds?.map((id) => axios.delete(`/specs-template/${id}`))
        );
        fetchData();
        setSelectedIds([]);
      } catch (error) {
        console.error("Error deleting selected records:", error);
      }
    }
  };

  const handleEditClick = (row) => {
    setEditingRow(row._id);
    setOriginalRowData(row); // Save the original data for cancelling
    setEditedRowData({ ...row });
  };

  const handleSaveClick = async () => {
    try {
      // Sending PUT request to update the specific data
      const response = await axios.put(
        `/api/specsTemplates/edit/${editedRowData._id}`,
        editedRowData
      );

      console.log("Updated successfully:", response.data);

      // After saving, reload the data
      fetchData();
      setEditingRow(null); // Close the editing mode
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleCancelClick = () => {
    // Restore the original row data when cancel is clicked
    setEditedRowData({ ...originalRowData });
    setEditingRow(null); // Close the editing mode
  };

  const handleDeleteClick = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`/api/specsTemplates/deleted/${id}`);
        fetchData();
      } catch (error) {
        console.error("Error deleting record:", error);
      }
    }
  };

  const handleChange = (e, field) => {
    setEditedRowData((prevData) => ({
      ...prevData,
      [field]: e.target.value,
    }));
  };

  return (
    <>
      <Navbar />
      <Box p={3}>
        <Box mb={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.history.back()} // Navigate to the previous page
          >
            <span style={{ marginRight: "8px" }}>←</span> Templates
          </Button>

          <Typography variant="h6" component="div" style={{ marginTop: 20 }}>
            {/* Template: {data?.specTemplateId?.Name || "Unnamed Template"} */}
            {/* {console.log("hahah", data?.specTemplateId?.Name)} */}
            Template: {data?.[0].specTemplateId?.Name || "Unnamed Templatea"}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Button variant="contained" color="primary" onClick={openModal}>
            Open POM Library
          </Button>
          <Button variant="contained" color="primary" onClick={handleSelectAll}>
            Select All
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUnselectAll}
          >
            Unselect All
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteSelected}
            disabled={selectedIds.length === 0}
          >
            Delete Selected
          </Button>
        </Box>

        {data ? (
          <TableContainer
            component={Paper}
            sx={{ borderRadius: 2, boxShadow: 3 }}
          >
            <Table sx={{ minWidth: 650, borderCollapse: "collapse" }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}></TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Code</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Tolerance</TableCell>
                  {dynamicKeys.map((key) => (
                    <TableCell key={key} sx={{ fontWeight: "bold" }}>
                      {key}
                    </TableCell>
                  ))}
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(row._id)}
                        onChange={() => handleCheckboxChange(row._id)}
                      />
                    </TableCell>
                    <TableCell>
                      {editingRow === row._id ? (
                        <TextField
                          value={editedRowData.code}
                          onChange={(e) => handleChange(e, "code")}
                          fullWidth
                        />
                      ) : (
                        row.code
                      )}
                    </TableCell>
                    <TableCell>
                      {editingRow === row._id ? (
                        <TextField
                          value={editedRowData.description}
                          onChange={(e) => handleChange(e, "description")}
                          fullWidth
                        />
                      ) : (
                        row.description
                      )}
                    </TableCell>
                    <TableCell>
                      {editingRow === row._id ? (
                        <TextField
                          value={editedRowData.tolerance}
                          onChange={(e) => handleChange(e, "tolerance")}
                          fullWidth
                        />
                      ) : (
                        row.tolerance
                      )}
                    </TableCell>
                    {dynamicKeys.map((key) => (
                      <TableCell key={key}>
                        {editingRow === row._id ? (
                          <TextField
                            value={editedRowData[key] || ""}
                            onChange={(e) => handleChange(e, key)}
                            fullWidth
                          />
                        ) : (
                          row[key]
                        )}
                      </TableCell>
                    ))}
                    <TableCell>
                      {editingRow === row._id ? (
                        <Box display="flex" gap={1}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSaveClick}
                          >
                            Save
                          </Button>
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleCancelClick}
                          >
                            Cancel
                          </Button>
                        </Box>
                      ) : (
                        <Box display="flex" gap={1}>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => handleEditClick(row)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleDeleteClick(row._id)}
                          >
                            Delete
                          </Button>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <TableContainer
            component={Paper}
            sx={{ borderRadius: 2, boxShadow: 3 }}
          >
            <Table sx={{ minWidth: 650, borderCollapse: "collapse" }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}></TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Code</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Tolerance</TableCell>
                  {dynamicKeys.map((key) => (
                    <TableCell key={key} sx={{ fontWeight: "bold" }}>
                      {key}
                    </TableCell>
                  ))}
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography>No data available</Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <OpenPOMModal
          open={isModalOpen}
          handleClose={closeModal}
          techPackId={techPackId}
          onPayloadSend={handlePayload}
        />
      </Box>
    </>
  );
};

export default SpecDetail;
