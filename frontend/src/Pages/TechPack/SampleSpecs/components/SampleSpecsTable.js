import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Tooltip,
  Button,
  IconButton,
} from "@mui/material";
import {
  Edit,
  Delete,
  ContentCopy,
  Clear,
  ContentPaste,
  Add,
} from "@mui/icons-material";

const columns = [
  "Design",
  "Initial",
  "1st PP",
  "diff +/-",
  "Rev1",
  "2nd PP",
  "diff +/-",
  "Rev2",
  "3rd PP",
  "diff +/-",
  "Final",
  "Ship.",
  "diff +/-",
];

const initialPOMs = [
  {
    code: "B0101",
    description: "Waist at top - relaxed",
    tolerance: "1/2",
    selected: false,
  },
  {
    code: "B0106",
    description: "Waist at top - extended",
    tolerance: "1/2",
    selected: false,
  },
  // Add other POMs here
];

function SampleSpecsTable() {
  const [size, setSize] = useState("2X");
  const [poms, setPoms] = useState(initialPOMs);
  const [selectedPOMs, setSelectedPOMs] = useState([]);
  const [inputValues, setInputValues] = useState(
    initialPOMs.reduce((acc, pom) => {
      acc[pom.code] = columns.reduce((colAcc, col) => {
        colAcc[col.toLowerCase().replace(/ /g, "")] = "";
        return colAcc;
      }, {});
      return acc;
    }, {})
  );

  const handleSelectAllPOMs = (event) => {
    if (event.target.checked) {
      setSelectedPOMs(poms.map((pom) => pom.code));
    } else {
      setSelectedPOMs([]);
    }
  };

  const handleSelectPOM = (code) => {
    setSelectedPOMs((prev) => {
      if (prev.includes(code)) {
        return prev.filter((c) => c !== code);
      }
      return [...prev, code];
    });
  };

  const handleDeleteSelected = () => {
    setPoms((prev) => prev.filter((pom) => !selectedPOMs.includes(pom.code)));
    setSelectedPOMs([]);
  };

  const handleCopy = (code, column) => {
    const valueToCopy = inputValues[code][column];
    navigator.clipboard
      .writeText(valueToCopy)
      .then(() => {
        console.log(`Copied: ${valueToCopy}`);
      })
      .catch((err) => {
        console.error("Error copying text: ", err);
      });
  };

  const handleClear = (code, column) => {
    setInputValues((prev) => ({
      ...prev,
      [code]: {
        ...prev[code],
        [column]: "", 
      },
    }));
  };

  const handleChangeInput = (code, column, event) => {
    const { value } = event.target;

    setInputValues((prev) => ({
      ...prev,
      [code]: {
        ...prev[code],
        [column]: value, 
      },
    }));
  };

  return (
    <Container maxWidth={false} sx={{ py: 4 }}>
      <Paper elevation={3}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="h6">Sample Specs</Typography>
        </Box>

        <Box
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            gap: 1,
          }}
        >
          <Button
            variant="outlined"
            size="small"
            onClick={() => setSelectedPOMs(poms.map((p) => p.code))}
            disabled={poms.length === selectedPOMs.length}
          >
            Select All
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setSelectedPOMs([])}
            disabled={selectedPOMs.length === 0}
          >
            Unselect All
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={handleDeleteSelected}
            disabled={selectedPOMs.length === 0}
            startIcon={<Delete />}
          >
            Delete Selected ({selectedPOMs.length})
          </Button>
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell colSpan={4}>Sample Status</TableCell>
                {columns.map((col, index) => (
                  <TableCell key={index}>{col}</TableCell>
                ))}
                <TableCell />
              </TableRow>
              <TableRow>
                <TableCell colSpan={4}>Date</TableCell>
                {columns.map((_, index) => (
                  <TableCell key={index}>
                    <TextField
                      type="date"
                      size="small"
                      InputProps={{ sx: { fontSize: "0.875rem" } }}
                    />
                  </TableCell>
                ))}
                <TableCell />
              </TableRow>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedPOMs.length > 0 &&
                      selectedPOMs.length < poms.length
                    }
                    checked={selectedPOMs.length === poms.length}
                    onChange={handleSelectAllPOMs}
                  />
                </TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Point of Measure Description</TableCell>
                <TableCell>Tol (+/-)</TableCell>
                {columns.map((_, index) => (
                  <TableCell key={index}>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <Tooltip title="Copy">
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleCopy(
                              "B0101",
                              _.toLowerCase().replace(/ /g, "")
                            )
                          }
                        >
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Clear Data">
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleClear(
                              "B0101",
                              _.toLowerCase().replace(/ /g, "")
                            )
                          }
                        >
                          <Clear fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Paste">
                        <IconButton size="small">
                          <ContentPaste fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                ))}
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {poms.map((pom) => (
                <TableRow key={pom.code}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedPOMs.includes(pom.code)}
                      onChange={() => handleSelectPOM(pom.code)}
                    />
                  </TableCell>
                  <TableCell>{pom.code}</TableCell>
                  <TableCell>{pom.description}</TableCell>
                  <TableCell>{pom.tolerance}</TableCell>
                  {columns.map((column, index) => (
                    <TableCell key={index}>
                      <TextField
                        size="small"
                        sx={{ width: 80 }}
                        value={
                          inputValues[pom.code]?.[
                            column.toLowerCase().replace(/ /g, "")
                          ] || ""
                        }
                        onChange={(e) =>
                          handleChangeInput(
                            pom.code,
                            column.toLowerCase().replace(/ /g, ""),
                            e
                          )
                        }
                        InputProps={{ sx: { fontSize: "0.875rem" } }}
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <IconButton size="small" color="primary">
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: "divider",
            display: "flex",
            gap: 1,
          }}
        >
          <Button variant="outlined" size="small" startIcon={<Add />}>
            Add Point of Measure
          </Button>
          <Button variant="outlined" size="small" startIcon={<Add />}>
            Add from Library
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default SampleSpecsTable;
