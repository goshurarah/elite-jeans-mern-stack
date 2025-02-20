import React, { useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
  Button,
  CircularProgress,
} from "@mui/material";
import Navbar from "../../Navbar/Navbar";

const mockData = [
  {
    vendor: "VN#1",
    orderNumber: "4900",
    styleNumber: "CC23932H-30",
    requestedETD: "01/27/2025",
    shipArrivalDate: "12/20/2024 - 01/04/2025",
    qtyOrdered: 2412,
    shippingQty: 2448,
    bookingNumber: "By Captain, Container#:GOSU1022858 [A620]",
    status: [{ type: "Received" }],
  },
  {
    vendor: "VN#1",
    orderNumber: "4900",
    styleNumber: "CC23932H-01",
    requestedETD: "01/27/2025",
    shipArrivalDate: "12/20/2024 - 01/04/2025",
    qtyOrdered: 1800,
    shippingQty: 1560,
    bookingNumber: "By Captain, Container#:GOSU1022858 [A620]",
    status: [
      { type: "Closed", quantity: 240 },
      { type: "Received", quantity: 1560 },
    ],
  },
  // Add more mock data as needed
];

const getStatusColor = (status) => {
  switch (status) {
    case "Received":
      return "success";
    case "Closed":
      return "error";
    case "In Transit":
      return "info";
    default:
      return "default";
  }
};

function ReceivingTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchFilter, setSearchFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = mockData.filter((row) =>
    Object.values(row).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchFilter.toLowerCase())
    )
  );

  // Calculate the "Showing X to Y of Z entries" text
  const startIndex = page * rowsPerPage + 1;
  const endIndex = Math.min((page + 1) * rowsPerPage, filteredData.length);
  const totalEntries = filteredData.length;

  // Pagination calculation
  const totalPages = Math.ceil(totalEntries / rowsPerPage);
  const paginationNumbers = [];
  for (let i = 0; i < totalPages; i++) {
    paginationNumbers.push(i);
  }

  return (
    <>
      <Navbar />
      <Box sx={{ p: 2 }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
            <Typography variant="h6" component="div">
              Order Items
            </Typography>
          </Box>

          <Box sx={{ p: 2 }}>
            <TextField
              label="Search..."
              variant="outlined"
              size="small"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              sx={{ mb: 2 }}
            />
          </Box>

          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f4f6f8", color: "#5c6bc0" }}>
                    Vendor
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f4f6f8", color: "#5c6bc0" }}>
                    Order Number
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f4f6f8", color: "#5c6bc0" }}>
                    Style Number
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f4f6f8", color: "#5c6bc0" }}>
                    Requested ETD
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f4f6f8", color: "#5c6bc0" }}>
                    Ship Arrival Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f4f6f8", color: "#5c6bc0" }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f4f6f8", color: "#5c6bc0" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <CircularProgress size={24} sx={{ color: "#5c6bc0" }} />
                    </TableCell>
                  </TableRow>
                ) : filteredData.length > 0 ? (
                  filteredData.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((row, index) => (
                    <TableRow key={index} sx={{ "&:hover": { backgroundColor: "#f5f5f5" }, transition: "background-color 0.3s ease" }}>
                      <TableCell>{row.vendor}</TableCell>
                      <TableCell>{row.orderNumber}</TableCell>
                      <TableCell>{row.styleNumber}</TableCell>
                      <TableCell>{row.requestedETD}</TableCell>
                      <TableCell>{row.shipArrivalDate}</TableCell>
                      <TableCell>
                        {row.status.map((status, index) => (
                          <Chip key={index} label={status.type} color={getStatusColor(status.type)} size="small" sx={{ mr: 1 }} />
                        ))}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Button variant="outlined" color="primary" size="small" sx={{ textTransform: "none", fontWeight: 500, "&:hover": { backgroundColor: "#e3f2fd" } }}>
                            View
                          </Button>
                          <Button variant="outlined" color="error" size="small" sx={{ textTransform: "none", fontWeight: 500, "&:hover": { backgroundColor: "#ffcdd2" } }}>
                            Delete
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ fontStyle: "italic", color: "#757575" }}>
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
            <Typography variant="body2">
              Showing {startIndex} to {endIndex} of {totalEntries} entries
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                disabled={page === 0}
                onClick={() => setPage((prev) => prev - 1)}
              >
                Previous
              </Button>
              {paginationNumbers.map((num) => (
                <Button
                  key={num}
                  variant={num === page ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setPage(num)}
                >
                  {num + 1}
                </Button>
              ))}
              <Button
                variant="outlined"
                size="small"
                disabled={page === totalPages - 1}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
}

export default ReceivingTable;
