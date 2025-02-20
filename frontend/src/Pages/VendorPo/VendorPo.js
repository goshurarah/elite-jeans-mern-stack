import React, { useState } from "react";
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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Navbar from "../../Navbar/Navbar";

import AddVendorPOModal from "./Modal/AddVendorPOModal";

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
}));

const data = [
  {
    vendor: "2549",
    date: "01/17/2025",
    orde: "FS#1",
    order: "YF#1",
    style: "",
    status: "Approved",
  },
  {
    contract: "2548",
    date: "01/10/2025",
    vendor: "YT#1",
    order: "YF#1",
    style: "",
    status: "Approved",
  },
  {
    contract: "2547",
    date: "01/07/2025",
    vendor: "YT#1",
    order: "YF#1",
    style: "",
    status: "Approved",
  },
  // ... more data
];

const VendorPo = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [contractToEdit, setContractToEdit] = useState(null);

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

  return (
    <>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <div style={{ border: "1px solid #f3f4f8" }}>
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              backgroundColor: "#fff",
              padding: "10px 0",
              borderBottom: "1px solid #ddd",
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#f3f4f8",
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
                + Add Purchase Order
              </StyledButton>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
              
                <TextField
                  placeholder="Search..."
                  variant="outlined"
                  size="small"
                />
              </div>
            </div>
          </div>

          <TableContainer
            component={Paper}
            // className="table-container_saleContract"
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
                  <TableCell>Vendor</TableCell>
                  <TableCell>Orders</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Processing Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow
                    key={index}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#f3f4f8" : "white",
                    }}
                  >
                    <TableCell>{row.vendor}</TableCell>
                    <TableCell>{row.order}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.status}</TableCell>
                   
                    
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        style={{ marginRight: "10px" }}
                        // onClick={() => handleOpenModal(row)} 
                      >
                        Download CSV
                      </Button>
                      <Button variant="contained" color="primary" size="small">
                      Download CSV Items
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <AddVendorPOModal
        open={modalOpen}
        onClose={handleCloseModal}
        contractToEdit={contractToEdit}
        onSave={handleSaveContract}
      />
    </>
  );
};

export default VendorPo;
