import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Box,
} from "@mui/material";
import axios from "axios";
import Navbar from "../../../Navbar/Navbar";
import "./SizeScaleAssignment.css";

const NewScaleAssignment = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    client: "",
    packBySize: false,
    itemType: "",
    category: "",
    class: "",
    sizeScale: "",
    sizeBreak: "",
    MP_per_MC: "",
    individualPolyBag: false,
    fittingSample: {
      size: "",
      piece: "",
      daysAfterWorkOrderDate: "",
      daysBeforeWorkOrderETDDate: "",
    },
    shippingSample: {
      size: "",
      piece: "",
      daysAfterWorkOrderDate: "",
      daysBeforeWorkOrderETDDate: "",
    },
  });
  const [clients, setClients] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [sizeScaleOptions, setSizeScaleOptions] = useState([]);
  const [sizeBreakOptions, setSizeBreakOptions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("api/clients")
      .then((response) => {
        setClients(response.data);
        return axios.get("api/item-types");
      })
      .then((response) => {
        setItemTypes(response.data);
        return axios.get("api/categories");
      })
      .then((response) => {
        setCategories(response.data);
        return axios.get("api/classes");
      })
      .then((response) => {
        setClassOptions(response.data);
        return axios.get("api/size-breaks");
      })
      .then((response) => {
        setSizeBreakOptions(response.data);
        return axios.get("api/size-scales");
      })
      .then((response) => {
        setSizeScaleOptions(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
    NewScale();
  }, []);
  const NewScale = () => {
    axios
      .get("api/new-scale-assignments")
      .then((response) => {
        setAssignments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching assignments:", error);
      });
  };
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleEdit = (assignment) => {
    console.log("assignment", assignment);
    setFormData({
      ...assignment,
      client: assignment.client._id,
      itemType: assignment.itemType._id,
      sizeBreak: assignment.sizeBreak._id,
      sizeScale: assignment.sizeScale._id,
      class: assignment.class._id,
      category: assignment.category._id,
      fittingSample: assignment.fittingSample || {},
      shippingSample: assignment.shippingSample || {},
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        await axios.delete(`api/new-scale-assignments/${id}`);
        setAssignments(
          assignments.filter((assignment) => assignment._id !== id)
        );
        alert("Assignment deleted successfully!");
      } catch (error) {
        console.error("Error deleting assignment:", error);
        alert("Failed to delete assignment.");
      }
    }
  };

  const handleNestedInputChange = (e, section) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [name]: value,
      },
    });
  };

  // const handleSelectChange = (selectedOption, fieldName) => {
  //   setFormData({ ...formData, [fieldName]: selectedOption?.value || "" });
  // };
  const handleSelectChange = (selectedValue, fieldName) => {
    setFormData({ ...formData, [fieldName]: selectedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.client || !formData.itemType || !formData.category) {
      alert("Please fill out all required fields.");
      return;
    }

    const isEditMode = formData._id;
    const url = isEditMode
      ? `api/new-scale-assignments/${formData._id}`
      : "api/new-scale-assignments";

    try {
      const response = isEditMode
        ? await axios.put(url, formData)
        : await axios.post(url, formData);

      if (isEditMode) {
        setAssignments(
          assignments.map((assignment) =>
            assignment._id === formData._id ? response.data : assignment
          )
        );
      } else {
        setAssignments([...assignments, response.data]);
      }
      NewScale();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Error submitting the assignment.");
    }
  };

  const resetForm = () => {
    setFormData({
      client: "",
      packBySize: false,
      individualPolyBag: false,
      itemType: "",
      category: "",
      class: "",
      sizeScale: "",
      sizeBreak: "",
      MP_per_MC: "",
      individualPolyBag: false,
      fittingSample: {
        size: "",
        piece: "",
        daysAfterWorkOrderDate: "",
        daysBeforeWorkOrderETDDate: "",
      },
      shippingSample: {
        size: "",
        piece: "",
        daysAfterWorkOrderDate: "",
        daysBeforeWorkOrderETDDate: "",
      },
    });
  };

  const renderDropdownOptions = (data) => {
    return data.map((item) => ({ value: item._id, label: item.name }));
  };

  return (
    <div>
      <Navbar />
      <div className="main_newScale">
        <Button
          variant="contained"
          color="primary"
          className="btn_add_new_scale"
          onClick={() => setShowModal(true)}
        >
          Add New Scale Assignment
        </Button>
        <Dialog
          open={showModal}
          onClose={() => {
            setShowModal(false);
            resetForm();
          }}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Add New Scale Assignment</DialogTitle>
          <DialogContent>
            {loading ? (
              <CircularProgress />
            ) : (
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Client"
                  fullWidth
                  select
                  value={formData.client}
                  onChange={(e) => handleSelectChange(e.target.value, "client")}
                  margin="normal"
                >
                  {renderDropdownOptions(clients).map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.packBySize}
                      onChange={handleInputChange}
                      name="packBySize"
                    />
                  }
                  label="Pack by Size"
                />
                {/* <FormControlLabel
                  control={
                    <Checkbox
                    checked={assignment.packBySize}
                    disabled  // Optionally disable it if you don't want to allow editing here
                  />
                    // <Checkbox
                    //   checked={formData.packBySize}
                    //   onChange={handleInputChange}
                    //   name="packBySize"
                    // />
                  }
                  label="Pack by Size"
                /> */}

                <TextField
                  label="Item Type"
                  fullWidth
                  select
                  value={formData.itemType}
                  onChange={(e) =>
                    handleSelectChange(e.target.value, "itemType")
                  }
                  margin="normal"
                >
                  {renderDropdownOptions(itemTypes).map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Category"
                  fullWidth
                  select
                  value={formData.category}
                  onChange={(e) =>
                    handleSelectChange(e.target.value, "category")
                  }
                  margin="normal"
                >
                  {renderDropdownOptions(categories).map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Class"
                  fullWidth
                  select
                  value={formData.class}
                  onChange={(e) => handleSelectChange(e.target.value, "class")}
                  margin="normal"
                >
                  {renderDropdownOptions(classOptions).map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Size Scale"
                  fullWidth
                  select
                  value={formData.sizeScale}
                  onChange={(e) =>
                    handleSelectChange(e.target.value, "sizeScale")
                  }
                  margin="normal"
                >
                  {renderDropdownOptions(sizeScaleOptions).map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Size Break"
                  fullWidth
                  select
                  value={formData.sizeBreak}
                  onChange={(e) =>
                    handleSelectChange(e.target.value, "sizeBreak")
                  }
                  margin="normal"
                >
                  {renderDropdownOptions(sizeBreakOptions).map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="MP per MC"
                  type="number"
                  fullWidth
                  value={formData.MP_per_MC}
                  onChange={handleInputChange}
                  name="MP_per_MC"
                  margin="normal"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.individualPolyBag}
                      onChange={handleInputChange}
                      name="individualPolyBag"
                    />
                  }
                  label="Individual Poly Bag"
                />
                <h5>Fitting Sample</h5>
                <TextField
                  label="Size"
                  fullWidth
                  value={formData.fittingSample.size}
                  onChange={(e) => handleNestedInputChange(e, "fittingSample")}
                  name="size"
                  margin="normal"
                />
                <TextField
                  label="Piece"
                  fullWidth
                  type="number"
                  value={formData.fittingSample.piece}
                  onChange={(e) => handleNestedInputChange(e, "fittingSample")}
                  name="piece"
                  margin="normal"
                />
                <TextField
                  label="Days After Work Order Date"
                  fullWidth
                  type="number"
                  value={formData.fittingSample.daysAfterWorkOrderDate}
                  onChange={(e) => handleNestedInputChange(e, "fittingSample")}
                  name="daysAfterWorkOrderDate"
                  margin="normal"
                />
                <TextField
                  label="Days Before Work Order ETD Date"
                  fullWidth
                  type="number"
                  value={formData.fittingSample.daysBeforeWorkOrderETDDate}
                  onChange={(e) => handleNestedInputChange(e, "fittingSample")}
                  name="daysBeforeWorkOrderETDDate"
                  margin="normal"
                />

                <h5>Shipping Sample</h5>
                <TextField
                  label="Size"
                  fullWidth
                  value={formData.shippingSample.size}
                  onChange={(e) => handleNestedInputChange(e, "shippingSample")}
                  name="size"
                  margin="normal"
                />
                <TextField
                  label="Piece"
                  fullWidth
                  type="number"
                  value={formData.shippingSample.piece}
                  onChange={(e) => handleNestedInputChange(e, "shippingSample")}
                  name="piece"
                  margin="normal"
                />
                <TextField
                  label="Days After Work Order Date"
                  fullWidth
                  type="number"
                  value={formData.shippingSample.daysAfterWorkOrderDate}
                  onChange={(e) => handleNestedInputChange(e, "shippingSample")}
                  name="daysAfterWorkOrderDate"
                  margin="normal"
                />
                <TextField
                  label="Days Before Work Order ETD Date"
                  fullWidth
                  type="number"
                  value={formData.shippingSample.daysBeforeWorkOrderETDDate}
                  onChange={(e) => handleNestedInputChange(e, "shippingSample")}
                  name="daysBeforeWorkOrderETDDate"
                  margin="normal"
                />

                <DialogActions>
                  <Button onClick={() => setShowModal(false)} color="primary">
                    Cancel
                  </Button>
                  <Button type="submit" color="primary">
                    Submit
                  </Button>
                </DialogActions>
              </form>
            )}
          </DialogContent>
        </Dialog>

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
                  Client
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f4f6f8",
                    color: "#5c6bc0",
                  }}
                >
                  Pack by Size
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
                  Category
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f4f6f8",
                    color: "#5c6bc0",
                  }}
                >
                  Class
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f4f6f8",
                    color: "#5c6bc0",
                  }}
                >
                  Size Scale
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f4f6f8",
                    color: "#5c6bc0",
                  }}
                >
                  Size Break
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f4f6f8",
                    color: "#5c6bc0",
                  }}
                >
                  MP per MC
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f4f6f8",
                    color: "#5c6bc0",
                  }}
                >
                  Individual Poly Bag
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#f4f6f8",
                    color: "#5c6bc0",
                  }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {assignments.map((assignment, index) => (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor:
                      index % 2 === 0 ? "rgba(0, 0, 0, 0.04)" : "transparent", // Dark background for even rows
                  }}
                >
                  <TableCell>
                    {clients.find(
                      (client) => client._id === assignment.client._id
                    )?.name || "N/A"}
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={assignment.packBySize}
                      disabled
                      sx={{
                        "&.Mui-checked": {
                          color: "#5c6bc0",
                        },
                      }}
                    />
                  </TableCell>
                  {/* <TableCell>{assignment.packBySize ? "Yes" : "No"}</TableCell> */}
                  <TableCell>
                    {itemTypes.find(
                      (itemType) => itemType._id === assignment.itemType._id
                    )?.name || "N/A"}
                  </TableCell>
                  <TableCell>
                    {categories.find(
                      (category) => category._id === assignment.category._id
                    )?.name || "N/A"}
                  </TableCell>
                  <TableCell>
                    {classOptions.find(
                      (option) => option._id === assignment.class._id
                    )?.name || "N/A"}
                  </TableCell>
                  <TableCell>
                    {sizeScaleOptions.find(
                      (sizeScale) => sizeScale._id === assignment.sizeScale._id
                    )?.name || "N/A"}
                  </TableCell>
                  <TableCell>
                    {sizeBreakOptions.find(
                      (sizeBreak) => sizeBreak._id === assignment.sizeBreak._id
                    )?.name || "N/A"}
                  </TableCell>
                  <TableCell>{assignment.MP_per_MC}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={assignment.individualPolyBag}
                      disabled
                      sx={{
                        "&.Mui-checked": {
                          color: "#5c6bc0",
                        },
                      }}
                    />
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
                        onClick={() => handleEdit(assignment)}
                      >
                        Edit
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
                        onClick={() => handleDelete(assignment._id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default NewScaleAssignment;
