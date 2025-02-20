import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Badge,
  Autocomplete,
  Select,
} from "@mui/material";
import { MenuItem, InputLabel, FormControl } from "@mui/material";
import {
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Save as SaveIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
} from "@mui/icons-material";
import axios from "axios";
import "./AddSalesContractModal.css";
function AddSalesContractModal({ open, onClose, contractToEdit,onCreateContractResponse }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedGroups, setExpandedGroups] = useState({});
  const [selectedItems, setSelectedItems] = useState({});
  const [selectedOption, setSelectedOption] = useState("");
  const [vendorFilter, setVendorFilter] = useState("");
  const [vendors, setVendors] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [noWorkOrdersMessage, setNoWorkOrdersMessage] = useState(""); 

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get("/api/vendors");
        setVendors(response.data);

        if (response.data.length > 0) {
          const firstVendorId = response.data[0]._id;
          setVendorFilter(firstVendorId);
          fetchVendorData(firstVendorId);
        }
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };

    fetchVendors();
  }, []);

  const fetchVendorData = async (vendorId) => {
    try {
      const response = await axios.get(
        `/api/work-orders/item-details/vendor/${vendorId}`
      );
      if (response.data.data && response.data.data.length > 0) {
        setGroupData(response.data.data);
        setNoWorkOrdersMessage(""); // Reset the message if work orders are found
      } else {
        setGroupData([]); // Clear any previous group data
        setNoWorkOrdersMessage("No work orders found for this vendor."); // Set the message
      }
    } catch (error) {
      console.error("Error fetching item details:", error);
      setGroupData([]); // Clear any previous group data in case of error
      setNoWorkOrdersMessage("No data for this vendor."); // Set error message
    }
  };

  const handleSelectChange = (event, value) => {
    const vendorId = value?._id || ""; // Extract vendor id from the selected value
    setVendorFilter(vendorId);
    setSelectedItems({});
    fetchVendorData(vendorId);
  };

  const handleExpandGroup = (groupIndex) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupIndex]: !prev[groupIndex],
    }));
  };

  const handleItemSelect = (groupIndex, itemIndex) => {
    setSelectedItems((prev) => ({
      ...prev,
      [`${groupIndex}-${itemIndex}`]: !prev[`${groupIndex}-${itemIndex}`],
    }));
  };

  const handleSelectAll = () => {
    const newSelectedItems = {};
    groupData.forEach((group, groupIndex) => {
      group.work_order_quotes.forEach((item, itemIndex) => {
        newSelectedItems[`${groupIndex}-${itemIndex}`] = true;
      });
    });
    setSelectedItems(newSelectedItems);
  };

  const handleUnselectAll = () => {
    setSelectedItems({});
  };

  const handleShowItems = () => {
    const newExpandedGroups = {};
    groupData.forEach((_, groupIndex) => {
      newExpandedGroups[groupIndex] = true;
    });
    setExpandedGroups(newExpandedGroups);
  };

  const handleHideItems = () => {
    const newExpandedGroups = {};
    groupData.forEach((_, groupIndex) => {
      newExpandedGroups[groupIndex] = false;
    });
    setExpandedGroups(newExpandedGroups);
  };
  const handleSelectGroupAll = (groupIndex) => {
    const newSelectedItems = { ...selectedItems };

    groupData[groupIndex].work_order_quotes.forEach((item, itemIndex) => {
      newSelectedItems[`${groupIndex}-${itemIndex}`] =
        !newSelectedItems[`${groupIndex}-${itemIndex}`];
    });

    setSelectedItems(newSelectedItems);
  };
  const handleCreateContracts = async () => {
    // Gather selected main IDs (assuming group._id is the main ID you want)
    const selectedMainIds = [];

    groupData.forEach((group, groupIndex) => {
      group.work_order_quotes.forEach((item, itemIndex) => {
        if (selectedItems[`${groupIndex}-${itemIndex}`]) {
          selectedMainIds.push(group._id); // Push the main group._id instead of item._id
        }
      });
    });

    if (selectedMainIds.length === 0) {
      alert("Please select at least one work order quote.");
      return;
    }

    const payload = {
      workOrderquoteId: selectedMainIds,
    };

    try {
      const response = await axios.post(
        "/api/work-orders/salesContract/create",
        payload
      );

      if (response) {
        onCreateContractResponse({ success: true, message: "Sales contract created successfully!" });

        onClose(); 
      }
    } catch (error) {
      console.error("Error creating sales contract:", error);
      alert("Error creating sales contract.");
    }
  };

  useEffect(() => {
    if (groupData.length > 0) {
      setExpandedGroups((prev) => ({
        ...prev,
        0: true, // Ensure the first group is always expanded
      }));
    }
  }, [groupData]);

  const selectedCount = Object.values(selectedItems).filter(Boolean).length;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle>
        Generate New Sales Contracts
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          <FormControl variant="outlined" style={{ minWidth: 150 }}>
            <Autocomplete
              value={
                vendors.find((vendor) => vendor._id === vendorFilter) || null
              }
              onChange={handleSelectChange}
              options={vendors}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => <TextField {...params} label="Vendor" />}
              isOptionEqualToValue={(option, value) => option._id === value._id}
            />
          </FormControl>

          {/* <TextField
            size="small"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          /> */}
          <Button
            size="small"
            startIcon={<CheckBoxIcon />}
            onClick={handleSelectAll}
            className="selectAllAddSaleModal"
          >
            Select All
          </Button>
          <Button
            size="small"
            startIcon={<CheckBoxOutlineBlankIcon />}
            onClick={handleUnselectAll}
            className="selectAllAddSaleModal"
          >
            Unselect All
          </Button>
          <div style={{ borderLeft: "1px solid #ddd", margin: "0 8px" }} />
          <Button
            size="small"
            startIcon={<ExpandMoreIcon />}
            onClick={handleShowItems}
            className="selectAllAddSaleModal"
          >
            Show Items
          </Button>
          <Button
            size="small"
            startIcon={<ExpandLessIcon />}
            onClick={handleHideItems}
            className="selectAllAddSaleModal"
          >
            Hide Items
          </Button>
        </div>

        {noWorkOrdersMessage && <div>{noWorkOrdersMessage}</div>}

        {groupData.length > 0 && (
          <TableContainer component={Paper}>
            {groupData.map((group, groupIndex) => (
              <React.Fragment key={groupIndex}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {/* <TableCell padding="checkbox">
                        <Checkbox />
                      </TableCell> */}
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={group.work_order_quotes.every(
                            (item, itemIndex) =>
                              selectedItems[`${groupIndex}-${itemIndex}`]
                          )}
                          onChange={() => handleSelectGroupAll(groupIndex)}
                        />
                      </TableCell>

                      <TableCell padding="checkbox">
                        <IconButton
                          size="small"
                          onClick={() => handleExpandGroup(groupIndex)}
                        >
                          {expandedGroups[groupIndex] ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                </Table>

                {expandedGroups[groupIndex] && (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox"></TableCell>
                        <TableCell>Vendor</TableCell>
                        <TableCell>Fabric</TableCell>
                        <TableCell>Notes</TableCell>
                        <TableCell>Created at</TableCell>
                        <TableCell>Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {group?.work_order_quotes?.map((item, itemIndex) => (
                        <TableRow
                          key={itemIndex}
                          sx={{
                            "&:nth-of-type(odd)": {
                              backgroundColor: "#f5f5f5",
                            },
                          }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={
                                !!selectedItems[`${groupIndex}-${itemIndex}`]
                              }
                              onChange={() =>
                                handleItemSelect(groupIndex, itemIndex)
                              }
                            />
                          </TableCell>
                          <TableCell>{item?.vendor?.name}</TableCell>
                          <TableCell>{item?.fabric}</TableCell>
                          <TableCell>{item?.notes}</TableCell>
                          <TableCell>{item?.date}</TableCell>
                          <TableCell>{item?.price}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </React.Fragment>
            ))}
          </TableContainer>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          startIcon={<SaveIcon />}
          variant="contained"
          disabled={selectedCount === 0}
          onClick={handleCreateContracts}
        >
          Create Contracts
          <Badge
            badgeContent={selectedCount}
            color="primary"
            sx={{ marginLeft: 1 }}
          />
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddSalesContractModal;
