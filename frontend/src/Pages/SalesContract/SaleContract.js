import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  InputLabel,
  FormControl,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Navbar from "../../Navbar/Navbar";
import axios from "axios";
import AddSalesContractModal from "./Modal/AddSalesContractModal";
import "./SaleContract.css";
import EditSalesContractModal from "./Modal/EditSalesContractModal";

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
}));

const SaleContract = () => {
  const [salesContracts, setSalesContracts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);

  const [contractToEdit, setContractToEdit] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState("");

  const handleVendorChange = (e) => {
    setSelectedVendor(e.target.value);
  };
  const fetchAllSalesContract = async () => {
    axios
      .get("/api/work-orders/salesContract/get/all")
      .then((response) => {
        setSalesContracts(response.data.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    fetchAllSalesContract();
  }, []);

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

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleOpenModal = (contract = null) => {
    setContractToEdit(contract);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setContractToEdit(null);
  };

  const handleSaveContract = (contractDetails) => {
    if (contractToEdit) {
      console.log("Updating contract", contractDetails);
    } else {
      // Add new contract logic
      console.log("Adding new contract", contractDetails);
    }
    handleCloseModal(); // Close modal after save
  };
  const handleOpenEditModal = (contract = null) => {
    setContractToEdit(contract);
    setModalEditOpen(true);
  };

  const handleCloseEditModal = () => {
    setModalEditOpen(false);
    setContractToEdit(null);
  };

  const handleSaveContractEdit = (contractDetails) => {
    if (contractToEdit) {
      console.log("Updating contract", contractDetails);
    } else {
      // Add new contract logic
      console.log("Adding new contract", contractDetails);
    }
    handleCloseEditModal(); // Close modal after save
  };
  const handleCreateContractResponse = (response) => {
    fetchAllSalesContract();
  };
  const handleUpdateContractResponse = (response) => {
    fetchAllSalesContract();
  };
  return (
    <>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <div style={{ border: "1px solid #91d5ff" }}>
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              backgroundColor: "#fff",
              padding: "10px 0",
              borderBottom: "1px solid #ddd",
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#d2f1ff",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                gap: "10px",
                padding: "0 20px",
              }}
            >
              <StyledButton
                variant="contained"
                color="primary"
                onClick={() => handleOpenModal()}
              >
                + Add Sales Contracts
              </StyledButton>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <FormControl variant="outlined" style={{ minWidth: 150 }}>
                  <InputLabel id="vendor-select-label">Vendor</InputLabel>
                  <Select
                    value={selectedVendor}
                    onChange={handleVendorChange}
                    label="Vendor"
                    displayEmpty
                    fullWidth
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
                </FormControl>
                {/* <TextField
                  placeholder="Search..."
                  variant="outlined"
                  size="small"
                /> */}
              </div>
            </div>
          </div>

          <TableContainer
            component={Paper}
            className="table-container_saleContract"
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    colSpan={7}
                    style={{ padding: "0px", textAlign: "left" }}
                  ></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Contract #</TableCell>
                  <TableCell>Contract Date</TableCell>
                  <TableCell>Vendor</TableCell>
                  <TableCell>Order #</TableCell>
                  <TableCell>Style #</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salesContracts &&
                  salesContracts?.map((contract, index) => (
                    <TableRow
                      key={index}
                      style={{
                        backgroundColor: index % 2 === 0 ? "#f0faff" : "white",
                      }}
                    >
                      <TableCell>{contract.contractId}</TableCell>
                      <TableCell>
                        {contract.contractDate
                          ? new Date(contract.contractDate).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {contract.workOrderquoteId[0]?.work_order_quotes[0]
                          ?.vendor?.name || "N/A"}
                      </TableCell>
                      <TableCell>
                        {contract.workOrderquoteId[0]?.orderNumber || "N/A"}
                      </TableCell>
                      <TableCell>
                        {contract?.workOrderquoteId[0]?.style_number || "N/A"}
                      </TableCell>
                      <TableCell style={{ color: "green" }}>
                        {contract?.status || "N/A"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          style={{ marginRight: "10px" }}
                          onClick={() => handleOpenEditModal(contract)}
                        >
                          Edit
                        </Button>
                        <Button variant="contained" color="error" size="small">
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <AddSalesContractModal
        open={modalOpen}
        onClose={handleCloseModal}
        onCreateContractResponse={handleCreateContractResponse}
        // contractToEdit={contractToEdit}
        onSave={handleSaveContract}
      />
      <EditSalesContractModal
        open={modalEditOpen}
        onClose={handleCloseEditModal}
        onUpdateContractResponse={handleUpdateContractResponse}
        contractToEdit={contractToEdit}
        onSave={handleSaveContractEdit}
      />
    </>
  );
};

export default SaleContract;
