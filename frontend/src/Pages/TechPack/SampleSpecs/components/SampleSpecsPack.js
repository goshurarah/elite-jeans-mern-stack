import React,{useState} from "react";
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  InputAdornment,
  Button,
  Grid,
  Typography,
  Container,
  Paper,

  Box,
} from "@mui/material";



const SampleSpecsPack = () => {
    const [garmentType, setGarmentType] = useState("PSS");
      const [size, setSize] = useState("2X");
    const garmentTypes = [
        { code: "PSS", label: "Pants/Shorts/Skirts" },
        { code: "OSS", label: "Overalls/Shortalls/Skirtalls" },
        { code: "TDK", label: "Tops/Dresses - Knits" },
        { code: "TDW", label: "Tops/Dresses - Wovens" },
      ];
      const sizeList = ["1X", "2X", "3X", "4X"];
    
  return (
    <>
    
      <Container maxWidth={false} sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <Typography variant="subtitle2" gutterBottom>
              Pack #
            </Typography>
            <TextField fullWidth disabled value="12345" size="small" />
            <Typography variant="subtitle2" sx={{ mt: 2 }}>
              Created on
            </Typography>
            <TextField
              fullWidth
              disabled
              //   value={format(new Date(), 'MM/dd/yyyy')}
              size="small"
            />
            <Typography variant="subtitle2" sx={{ mt: 2 }}>
              Style #
            </Typography>
            <TextField fullWidth disabled value="ST001" size="small" />
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Garment Type</InputLabel>
              <Select
                value={garmentType}
                onChange={(e) => setGarmentType(e.target.value)}
                label="Garment Type"
              >
                {garmentTypes.map((type) => (
                  <MenuItem key={type.code} value={type.code}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Fabric Content"
              size="small"
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Customer / Brand"
              size="small"
              sx={{ mt: 2 }}
            />
            <FormControl fullWidth size="small" sx={{ mt: 2 }}>
              <InputLabel>Size</InputLabel>
              <Select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                label="Size"
              >
                {sizeList.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              label="Garment Specs Details"
              multiline
              rows={5}
            />
          </Grid>
          <Grid item xs={3}>
            <Box
              component="img"
              src="https://elite-jeans.s3.amazonaws.com/572bd70ab074f99968bd323a25bcd2e0.jpg"
              sx={{
                width: "100%",
                height: "auto",
                borderRadius: 1,
              }}
            />
          </Grid>
        </Grid>
      </Paper>
      </Container>
    </>
  );
};

export default SampleSpecsPack;
