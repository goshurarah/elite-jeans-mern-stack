import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Navbar from "../../../Navbar/Navbar";
import ASNDialog from "../Modal/Shipping/ASNDialog";
import ArrangementDialog from "../Modal/Arrangement/ArrangementDialog";
import axios from "axios";

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
}));

const ShippingTable = () => {
  const [openASNDialog, setOpenASNDialog] = useState(false);
  const [openArrangementDialog, setOpenArrangementDialog] = useState(false);
  const [data, setData] = useState([]); // State to store fetched data

  useEffect(() => {
    axios
      .get("/api/work-orders/item-detail/getAll")
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);
  const handleOpenASNDialog = () => {
    setOpenASNDialog(true);
  };

  const handleCloseASNDialog = () => {
    setOpenASNDialog(false);
  };

  const handleOpenArrangementDialog = () => {
    setOpenArrangementDialog(true);
  };

  const handleCloseArrangementDialog = () => {
    setOpenArrangementDialog(false);
  };
  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <div style={{ border: "1px solid #f6f6f6" }}>
          <div
            style={{
              //   position: "sticky",
              top: 0,
              zIndex: 1,
              backgroundColor: "#fff",
              padding: "10px 0",
              border: "1px solid #f6f6f6",
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#f6f6f6",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                gap: "10px",
                padding: "0 20px",
                flexWrap: "wrap", // Allow wrapping if it overflows
              }}
            >
              <StyledButton
                variant="contained"
                color="primary"
                onClick={handleOpenASNDialog}
              >
                + Add ASN
              </StyledButton>
              <StyledButton
                variant="contained"
                color="primary"
                onClick={handleOpenArrangementDialog}
              >
                + Add Arrangements
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

              {/* Checkbox Section */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  flexWrap: "wrap", // Allow wrapping on smaller screens
                }}
              >
                <FormControlLabel
                  control={<Checkbox name="open" />}
                  label="Open"
                />
                <FormControlLabel
                  control={<Checkbox name="readyToShip" />}
                  label="Ready to Ship"
                />
                <FormControlLabel
                  control={<Checkbox name="arranged" />}
                  label="Arranged"
                />
                <FormControlLabel
                  control={<Checkbox name="inTransit" />}
                  label="In Transit"
                />
                <FormControlLabel
                  control={<Checkbox name="received" />}
                  label="Received"
                />
                <FormControlLabel
                  control={<Checkbox name="pending" />}
                  label="Pending"
                />
              </div>

              {/* Buttons */}
              {/* <StyledButton variant="contained" color="primary">
                Filter
              </StyledButton>
              <StyledButton variant="contained" color="secondary">
                Reset
              </StyledButton> */}
            </div>
          </div>

          <TableContainer
            component={Paper}
            className="table-container_saleContract"
            style={{ overflowX: "auto" }} // To allow horizontal scroll on smaller screens
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
                  <TableCell>Order #</TableCell>
                  <TableCell>Style #</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Sample Status</TableCell>
                  <TableCell>Qty Ordered</TableCell>
                  <TableCell>Qty / Carton</TableCell>
                  <TableCell>Total Cartons</TableCell>
                  <TableCell>CBM</TableCell>
                  <TableCell>Vendor</TableCell>
                  <TableCell>ETD</TableCell>
                  <TableCell>ASN #</TableCell>
                  <TableCell>Ship -Arrival Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Map through the data to create table rows */}
                {data.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item?.workOrder_Id?.workOrderId}</TableCell>
                    <TableCell>{item?.style_number}</TableCell>
                    <TableCell>{item?.client_Id.name}</TableCell>{" "}
                    {/* Client name from client_Id */}
                    <TableCell>
                      {/* Work Order Quotes: you can adjust this depending on how you want to display the quote details */}
                      {item.work_order_quotes &&
                      item.work_order_quotes.length > 0
                        ? item.work_order_quotes.map((quote, quoteIndex) => (
                            <div key={quoteIndex}>{quote.status}</div>
                          ))
                        : "No Quotes"}
                    </TableCell>
                    <TableCell>{/* Placeholder for Qty Ordered */}</TableCell>
                    <TableCell>
                      {/* Placeholder for Qty per Carton */}
                    </TableCell>
                    <TableCell>{/* Placeholder for Total Cartons */}</TableCell>
                    <TableCell>{/* Placeholder for CBM */}</TableCell>
                    <TableCell>{/* Placeholder for Vendor */}
                    {item?.workOrder_Id?.vendor?.name}
                    </TableCell>
                    <TableCell>{/* Placeholder for ETD */}</TableCell>
                    <TableCell>{/* Placeholder for ASN # */}</TableCell>
                    <TableCell>
                      {/* Placeholder for Ship - Arrival Date */}
                    </TableCell>
                    <TableCell>{/* Placeholder for Status */}</TableCell>
                    <TableCell>{/* Edit and Download buttons */}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <ASNDialog open={openASNDialog} onClose={handleCloseASNDialog} />
      <ArrangementDialog
        open={openArrangementDialog}
        onClose={handleCloseArrangementDialog}
      />
    </div>
  );
};

export default ShippingTable;
