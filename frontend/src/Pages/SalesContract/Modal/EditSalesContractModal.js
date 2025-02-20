import React, { useEffect, useState } from "react";
import {
  Dialog,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Grid,
  TableFooter,
} from "@mui/material";
import axios from "axios";
function EditSalesContractModal({ open, onClose, contractToEdit,onUpdateContractResponse }) {
  console.log("hasan check",contractToEdit);
  // State to manage the form data
  const [formData, setFormData] = useState({
    styleNo: "",
    contractDate: "",
    clientId: "",
    vendorId: "",
    price: "",
    fabric: "",
    comments: "",
    internalComments: "",
    customerPONumber: "",
    bankName: "",
    vendorCompanyName: "",
    acc_num: "",
    FOBPort: "",
    vendor_benificary: "",
    bank_address: "",
  });

  // Set the state when contractToEdit changes
  useEffect(() => {
    if (contractToEdit) {
      const quote =
        contractToEdit?.workOrderquoteId?.[0]?.work_order_quotes?.[0]; // Accessing the first quote
      setFormData({
        styleNo: contractToEdit?.styleNo,
        contractDate: contractToEdit?.contractDate,
        clientId: contractToEdit?.workOrderquoteId?.[0]?.client_Id,
        vendorId: quote?.vendor?._id,
        price: quote?.price,
        fabric: quote?.fabric,
        comments: contractToEdit?.workOrderquoteId?.[0]?.comments,
        internalComments:
          contractToEdit?.workOrderquoteId?.[0]?.internal_comments,
        customerPONumber:
          contractToEdit?.workOrderquoteId?.[0]?.customer_po_number,
        bankName: contractToEdit?.bankName || "",
        vendorCompanyName: contractToEdit?.vendorCompanyName || "",
        acc_num: contractToEdit?.acc_num || "",
        FOBPort: contractToEdit?.FOBPort || "",
        vendor_benificary: contractToEdit?.vendor_benificary || "",
        bank_address: contractToEdit?.bank_address || "",
      });
    }
  }, [contractToEdit]);

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Save Changes
  const handleSaveChanges = async () => {
    try {
      const updatedContract = {
        ...formData,
        // Add other necessary fields as needed
      };

      // Make the API request
      const response = await axios.put(
        `/api/work-orders/salesContract/update/${contractToEdit._id}`,
        updatedContract
      );

      // Handle success response
      if (response) {
        onUpdateContractResponse({ success: true, message: "Sales contract updated successfully!" });

        // Optionally close the modal and reset form state
        onClose();
        // Maybe show a success message
      }
    } catch (error) {
      // Handle error (you can display an error message here)
      console.error("Error updating contract", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <div style={{ padding: "20px" }}>
        <h2>Edit Sales Contract</h2>

        {/* Use Grid for two fields per row */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4} md={4}>
            <TextField
              label="Style No"
              value={formData.styleNo}
              onChange={handleChange}
              name="styleNo"
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <TextField
              label="Contract Date"
              value={formData.contractDate}
              onChange={handleChange}
              name="contractDate"
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <TextField
              label="Client ID"
              value={formData.clientId}
              onChange={handleChange}
              name="clientId"
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <TextField
              label="Vendor ID"
              value={formData.vendorId}
              onChange={handleChange}
              name="vendorId"
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <TextField
              label="Bank Name & Swift Code"
              value={formData.bankName}
              onChange={handleChange}
              name="bankName"
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <TextField
              label="Vendor Company Name"
              value={formData.vendorCompanyName}
              onChange={handleChange}
              name="vendorCompanyName"
              fullWidth
              margin="normal"
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <TextField
              label="Account Number"
              value={formData.acc_num}
              onChange={handleChange}
              name="acc_num"
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <TextField
              label="FOB Port"
              value={formData.FOBPort}
              onChange={handleChange}
              name="FOBPort"
              fullWidth
              margin="normal"
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <TextField
              label="Vendor Beneficiary Address "
              value={formData.vendor_benificary}
              onChange={handleChange}
              name="vendor_benificary"
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={4} md={4}>
            <TextField
              label="Bank Address"
              value={formData.bank_address}
              onChange={handleChange}
              name="bank_address"
              fullWidth
              margin="normal"
            />
          </Grid>
        </Grid>

        {/* Table to display workOrderQuotes */}
        <h3>Work Order Quotes</h3>
        <Table style={{ border: "1px solid #91d5ff", borderRadius: "4px" }}>
          <TableHead style={{ backgroundColor: "#91d5ff" }}>
            <TableRow>
              <TableCell>Vendor</TableCell>
              <TableCell>Fabric</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Amount</TableCell> {/* Amount column */}
            </TableRow>
          </TableHead>
          <TableBody>
            {contractToEdit?.workOrderquoteId?.[0]?.work_order_quotes?.map(
              (quote, index) => {
                const amount =
                  quote.price * contractToEdit?.workOrderquoteId[0]?.quantity; // Calculating amount
                return (
                  <TableRow
                    key={quote._id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "white" : "#f0f8ff", // Odd rows get a different background color
                    }}
                  >
                    <TableCell>{quote.vendor?.name}</TableCell>
                    <TableCell>{quote.fabric}</TableCell>
                    <TableCell>{quote.status}</TableCell>
                    <TableCell>{quote.price}</TableCell>
                    <TableCell>
                      {contractToEdit?.workOrderquoteId[0]?.quantity}
                    </TableCell>
                    <TableCell>{amount}</TableCell> {/* Displaying Amount */}
                  </TableRow>
                );
              }
            )}
          </TableBody>
          <TableFooter style={{ backgroundColor: "#91d5ff" }}>
            <TableRow>
              <TableCell colSpan={4}>
                <strong>Total Quantity:</strong>
              </TableCell>
              <TableCell>
                <strong>
                  {contractToEdit?.workOrderquoteId[0]?.work_order_quotes?.reduce(
                    (sum, quote) => {
                      return (
                        sum + contractToEdit?.workOrderquoteId[0]?.quantity
                      );
                    },
                    0
                  )}
                </strong>
              </TableCell>
              <TableCell>
                <strong>
                  {contractToEdit?.workOrderquoteId[0]?.work_order_quotes?.reduce(
                    (sum, quote) => {
                      const amount =
                        quote.price *
                        contractToEdit?.workOrderquoteId[0]?.quantity;
                      return sum + amount;
                    },
                    0
                  )}
                </strong>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        {/* Buttons */}
        <Button
          onClick={onClose}
          variant="outlined"
          style={{ marginTop: "20px" }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSaveChanges}
          variant="contained"
          color="primary"
          style={{ marginLeft: "10px", marginTop: "20px" }}
        >
          Save Changes
        </Button>
      </div>
    </Dialog>
  );
}

export default EditSalesContractModal;
