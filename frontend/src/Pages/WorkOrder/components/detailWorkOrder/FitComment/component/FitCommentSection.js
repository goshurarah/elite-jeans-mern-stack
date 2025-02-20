import React, { useState } from "react";
import { Select, MenuItem, FormControl, InputLabel, Button, Tabs, Tab, TextField, Box, Grid } from "@mui/material";
import "./FitCommentSection.css";

// Sample additional images section
const AdditionalImages = ({ isEditing }) => {
  return (
    <div>
      <h3>Additional Images</h3>
      <div className="additional-images">
        {isEditing && (
          <Button variant="contained" component="label">
            Upload Additional Image
            <input type="file" hidden />
          </Button>
        )}
      </div>
    </div>
  );
};

function FitCommentSection({workOrderId}) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [comment, setComment] = useState("");
  const [completedBy, setCompletedBy] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [date, setDate] = useState("");
  const [frontImage, setFrontImage] = useState(null);
  const [sideImage, setSideImage] = useState(null);
  const [backImage, setBackImage] = useState(null);

  const tabData = [
    { comment: "1stPP Comment", frontImage: null, sideImage: null, backImage: null },
    { comment: "2ndPP Comment", frontImage: null, sideImage: null, backImage: null },
    { comment: "3rdPP Comment", frontImage: null, sideImage: null, backImage: null },
    { comment: "Shipping Comment", frontImage: null, sideImage: null, backImage: null },
    { comment: "Other Comment", frontImage: null, sideImage: null, backImage: null }
  ];

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setComment(tabData[newValue].comment);
    setFrontImage(tabData[newValue].frontImage);
    setSideImage(tabData[newValue].sideImage);
    setBackImage(tabData[newValue].backImage);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setComment(tabData[selectedTab].comment);
    setFrontImage(tabData[selectedTab].frontImage);
    setSideImage(tabData[selectedTab].sideImage);
    setBackImage(tabData[selectedTab].backImage);
  };

  const handleDownloadClick = () => {
    console.log("Downloading...");
  };

  const handleImageUpload = (event, imageType) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (imageType === "front") setFrontImage(url);
      if (imageType === "side") setSideImage(url);
      if (imageType === "back") setBackImage(url);
    }
  };

  return (
    <div className="main_fit_comment_section">
      <div className="Heading_fit_comment">
        <h2>Fit Comments</h2>
      </div>
      <div className="select_main_fit_coment">
        <FormControl sx={{ width: "25%" }} margin="normal">
          <InputLabel id="dropdown1-label">Choose an option 1</InputLabel>
          <Select labelId="dropdown1-label" id="dropdown1" label="Choose an option 1">
            <MenuItem value="option1">Option 1</MenuItem>
            <MenuItem value="option2">Option 2</MenuItem>
            <MenuItem value="option3">Option 3</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ width: "25%" }} margin="normal">
          <InputLabel id="dropdown2-label">Choose an option 2</InputLabel>
          <Select labelId="dropdown2-label" id="dropdown2" label="Choose an option 2">
            <MenuItem value="optionA">Option A</MenuItem>
            <MenuItem value="optionB">Option B</MenuItem>
            <MenuItem value="optionC">Option C</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Tabs Section */}
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        sx={{ display: "flex", justifyContent: "flex-start" }} // Align tabs to the start
      >
        <Tab label="1stPP" />
        <Tab label="2ndPP" />
        <Tab label="3rdPP" />
        <Tab label="SHIPPING" />
        <Tab label="OTHER" />
      </Tabs>

      {/* Tab Content */}
      <div className="tab-content">
        <Box sx={{ padding: 2 }}>
          {/* Buttons to edit or cancel */}
          {isEditing ? (
            <Button variant="contained" color="secondary" onClick={handleCancelClick} sx={{ marginRight: 2 }}>
              Cancel
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleEditClick} sx={{ marginRight: 2 }}>
              Edit
            </Button>
          )}
          {!isEditing && (
            <Button variant="contained" color="secondary" onClick={handleDownloadClick}>
              Download
            </Button>
          )}

          {/* Date Field */}
          {isEditing && (
            <div className="date-field">
              <TextField
                label="Date"
                type="date"
                fullWidth
                value={date}
                onChange={(e) => setDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ marginTop: 2 }}
              />
            </div>
          )}

          {/* Comment Section */}
          {isEditing ? (
            <div className="comment-section">
              <TextField
                label="Add a Comment"
                fullWidth
                multiline
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                sx={{ marginTop: 2 }}
              />
            </div>
          ) : (
            <div className="display-comment">
              <p>{comment}</p>
            </div>
          )}

          {/* "Completed By" and Select Option */}
          {isEditing && (
            <div className="completed-by-section">
              <TextField
                label="Completed By"
                fullWidth
                value={completedBy}
                onChange={(e) => setCompletedBy(e.target.value)}
                sx={{ marginTop: 2 }}
              />
              <FormControl fullWidth sx={{ marginTop: 2 }}>
                <InputLabel id="select-label">Select Option</InputLabel>
                <Select
                  labelId="select-label"
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  label="Select Option"
                >
                  <MenuItem value="option1">Option 1</MenuItem>
                  <MenuItem value="option2">Option 2</MenuItem>
                  <MenuItem value="option3">Option 3</MenuItem>
                </Select>
              </FormControl>
            </div>
          )}

          {/* Image Section */}
          <div className="image-section">
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <div className="image">
                  <h3>Front View</h3>
                  {frontImage ? (
                    <img src={frontImage} alt="Front" width="100%" />
                  ) : (
                    isEditing && (
                      <Button variant="contained" component="label">
                        Upload Front Image
                        <input type="file" hidden onChange={(e) => handleImageUpload(e, "front")} />
                      </Button>
                    )
                  )}
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="image">
                  <h3>Side View</h3>
                  {sideImage ? (
                    <img src={sideImage} alt="Side" width="100%" />
                  ) : (
                    isEditing && (
                      <Button variant="contained" component="label">
                        Upload Side Image
                        <input type="file" hidden onChange={(e) => handleImageUpload(e, "side")} />
                      </Button>
                    )
                  )}
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="image">
                  <h3>Back View</h3>
                  {backImage ? (
                    <img src={backImage} alt="Back" width="100%" />
                  ) : (
                    isEditing && (
                      <Button variant="contained" component="label">
                        Upload Back Image
                        <input type="file" hidden onChange={(e) => handleImageUpload(e, "back")} />
                      </Button>
                    )
                  )}
                </div>
              </Grid>
            </Grid>
          </div>

          {/* Additional Images Section */}
          <AdditionalImages isEditing={isEditing} />
        </Box>
      </div>
    </div>
  );
}

export default FitCommentSection;
