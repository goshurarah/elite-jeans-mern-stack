import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
} from "@mui/material";
import axios from "axios";

const OpenPOMModal = ({ open, handleClose, techPackId, onPayloadSend }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (open) {
      setLoading(true);
      setError(null);
      setSuccessMessage("");
      setErrorMessage("");
      axios
        .get("/api/point-of-measure")
        .then((response) => {
          setData(response.data);
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to fetch data");
          setLoading(false);
        });
    }
  }, [open]);

  const handleCheckboxChange = (event, item) => {
    if (event.target.checked) {
      setSelectedItems([...selectedItems, item]);
    } else {
      setSelectedItems(selectedItems.filter((selected) => selected !== item));
    }
  };

  const handleAdd = () => {
    const payload = {
      specTemplateId: techPackId,
      selectedPomIds: selectedItems.map((item) => item._id),
    };

    axios
      .post(`/api/specsTemplates/addPOMs`, payload)
      .then((response) => {
        setSuccessMessage(`Successfully added ${selectedItems.length} item(s)`);
        setErrorMessage("");
        handleClose();
        if (onPayloadSend) {
          onPayloadSend(response.data); // You can customize this if needed
        }

      })
      .catch((err) => {
        console.log("error check", err.response.data.error);
        setErrorMessage("Error adding items: " + err.response.data.error);
        setSuccessMessage(""); // Clear previous success message
      });
  };

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
          POM Library
        </Typography>
        <Typography sx={{ mt: 2 }}>
          This is the POM Library modal content.
        </Typography>

        {loading ? (
          <Typography sx={{ mt: 2 }}>Loading...</Typography>
        ) : error ? (
          <Typography sx={{ mt: 2, color: "error.main" }}>{error}</Typography>
        ) : (
          <>
            <TableContainer component={Paper} sx={{ mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.length === data.length}
                        indeterminate={
                          selectedItems.length > 0 &&
                          selectedItems.length < data.length
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems(data);
                          } else {
                            setSelectedItems([]);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Tolerance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(item)}
                          onChange={(e) => handleCheckboxChange(e, item)}
                        />
                      </TableCell>
                      <TableCell>{item.code}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.tolerance}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {successMessage && (
              <Typography sx={{ mt: 2, color: "success.main" }}>
                {successMessage}
              </Typography>
            )}

            {errorMessage && (
              <Typography sx={{ mt: 2, color: "error.main" }}>
                {errorMessage}
              </Typography>
            )}

            <Box mt={3} textAlign="right">
              <Typography sx={{ mb: 2 }}>
                Selected Items: {selectedItems.length}
              </Typography>
              <Button
                onClick={handleAdd}
                variant="contained"
                color="secondary"
                disabled={selectedItems.length === 0}
              >
                Add{" "}
                {selectedItems.length > 0 ? `(${selectedItems.length})` : ""}
              </Button>
              <Button
                onClick={handleClose}
                variant="contained"
                color="primary"
                sx={{ ml: 2 }}
              >
                Close
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default OpenPOMModal;
