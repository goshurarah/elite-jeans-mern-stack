import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopSection from "./component/TopSection";
import FitCommentSection from "./component/FitCommentSection";
import Navbar from "../../../../../Navbar/Navbar";
import { Box, Button } from "@mui/material";

function FitComment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const test = () => {
    navigate(-1);
  };
  return (
    <div>
      <Navbar />

      <Box display="flex" justifyContent="flex-start" m={2}>
     
      <Button onClick={test} variant="contained" color="primary">
        {" "}
        Work Order
      </Button>
       
      </Box>
      <TopSection workOrderId={id}/>
      <FitCommentSection  workOrderId={id} />
    </div>
  );
}

export default FitComment;
