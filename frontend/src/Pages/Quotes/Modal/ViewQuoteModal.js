import React from "react";
import {
  Modal,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import axios from "axios";

const ViewQuoteModal = ({
  open,
  handleClose,
  quoteData,
  setQuoteData,
  selectedQuoteId,
}) => {
  // const deleteQuote = async (quoteId, index) => {
  //   console.log("please check", quoteId, "oo i see", index);
  //   try {
  //     await axios.delete(`/api/techPack/quote/${quoteId}`);

  //     const updatedQuotes = quoteData?.data.filter(quote => quote._id !== quoteId);
  //     setQuoteData(prevState => ({
  //       ...prevState,
  //       data: updatedQuotes,
  //     }));

  //     console.log('Quote deleted successfully');
  //   } catch (error) {
  //     console.error("Error deleting quote:", error);
  //   }
  // };
  const deleteQuote = async (quoteId, index) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this quote?"
    );

    if (!confirmDelete) {
      return; // If the user cancels, exit the function
    }

    try {
      // Make the API call to delete the quote
      await axios.delete(`/api/techPack/quote/${selectedQuoteId}/${index}`);

      // Immediately update the state to remove the quote from the UI
      setQuoteData((prevState) => {
        const updatedQuotes = [...prevState.data];
        updatedQuotes.splice(index, 1); // Remove the quote at the specified index
        return {
          ...prevState,
          data: updatedQuotes, // Update the state with the new list of quotes
        };
      });

      console.log("Quote deleted successfully");
    } catch (error) {
      console.error("Error deleting quote:", error);
    }
  };

  const quotes =
    quoteData?.data && Array.isArray(quoteData.data) ? quoteData.data : [];

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="pom-library-modal"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography id="pom-library-modal" variant="h6" component="h2">
          Quote Details
        </Typography>

        {quotes.length > 0 ? (
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table aria-label="quote table">
              <TableHead>
                <TableRow>
                  <TableCell>Price</TableCell>
                  <TableCell>Vendor</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Fabric</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell>Action</TableCell> {/* Action column for Delete */}
                </TableRow>
              </TableHead>
              <TableBody>
                {quotes.map((quote, index) => (
                  <TableRow key={quote._id}>
                    <TableCell>{quote.price}</TableCell>
                    <TableCell>{quote.vendor.name}</TableCell>
                    <TableCell>
                      {new Date(quote.date).toLocaleString()}
                    </TableCell>
                    <TableCell>{quote.fabric}</TableCell>
                    <TableCell>{quote.notes}</TableCell>
                    <TableCell>
                      {/* Delete button for each quote */}
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => deleteQuote(quote._id, index)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography sx={{ mt: 2 }} variant="body2" color="textSecondary">
            No quote data available.
          </Typography>
        )}
      </Box>
    </Modal>
  );
};

export default ViewQuoteModal;
