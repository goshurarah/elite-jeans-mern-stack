// // import { useState } from "react";
// // import { useParams } from "react-router-dom";
// // import Navbar from "../../../Navbar/Navbar";
// // import SampleSpecsTable from "./components/SampleSpecsTable";
// // import SampleSpecsPack from "./components/SampleSpecsPack";
// // import "./SampleSpecsMain.css";
// // import SampleSpecForm from "./Tab/Tabs";
// // import TechPackControls from "./Test/TechPackControls";
// // function SampleSpecsMain() {
// //   const { techPackId } = useParams();
// //   const [activeTab, setActiveTab] = useState("sampleSpecs");

// //   const renderTabContent = () => {
// //     switch (activeTab) {
// //       case "sampleSpecs":
// //         return (
// //           <div>
// //             <SampleSpecsPack />
// //             <SampleSpecsTable />
// //           </div>
// //         );
// //       case "add":
// //         return <SampleSpecForm />;
// //       default:
// //         return null;
// //     }
// //   };

// //   return (
// //     <div>
// //       <Navbar />
// //       <div className="d-flex">
// //         <button>a</button>
// //         <button>Sample</button>
// //         <button>Sample 2</button>
// //       </div>
// //       <div className="tabs-container">
// //         <button
// //           className={`tab ${activeTab === "sampleSpecs" ? "active-tab" : ""}`}
// //           onClick={() => setActiveTab("sampleSpecs")}
// //         >
// //           Sample Specs
// //         </button>
// //         <button
// //           className={`tab ${activeTab === "add" ? "active-tab" : ""}`}
// //           onClick={() => setActiveTab("add")}
// //         >
// //           Add
// //         </button>
// //       </div>
// //       <div className="tab-content">{renderTabContent()}</div>
// //     </div>
// //   );
// // }

// // export default SampleSpecsMain;
// import { useState } from "react";
// import { useParams } from "react-router-dom";
// import Navbar from "../../../Navbar/Navbar";
// import SampleSpecsTable from "./components/SampleSpecsTable";
// import SampleSpecsPack from "./components/SampleSpecsPack";
// import "./SampleSpecsMain.css";
// import SampleSpecForm from "./Tab/Tabs";
// import TechPackControls from "./Test/TechPackControls";
// // import Sample2Component from "./components/Sample2Component"; // Import your Sample2 component

// function SampleSpecsMain() {
//   const { techPackId } = useParams();
//   const [activeTab, setActiveTab] = useState("sampleSpecs");
//   const [activeButton, setActiveButton] = useState("sample"); // Track active button

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case "sampleSpecs":
//         return (
//           <div>
//             <SampleSpecsPack />
//             <SampleSpecsTable />
//           </div>
//         );
//       case "add":
//         return <SampleSpecForm />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <div className="d-flex">
//         <button
//           className={`btn ${activeButton === "sample" ? "active-btn" : ""}`}
//           onClick={() => setActiveButton("sample")}
//         >
//           Back
//         </button>
//         <button
//           className={`btn ${activeButton === "sample" ? "active-btn" : ""}`}
//           onClick={() => setActiveButton("sample")}
//         >
//           Sample
//         </button>
//         <button
//           className={`btn ${activeButton === "sample2" ? "active-btn" : ""}`}
//           onClick={() => setActiveButton("sample2")}
//         >
//           Sample 2
//         </button>
//       </div>

//       {/* Conditionally render based on the active button */}
//       {activeButton === "sample" && (
//         <>
//           <div className="tabs-container">
//             <button
//               className={`tab ${
//                 activeTab === "sampleSpecs" ? "active-tab" : ""
//               }`}
//               onClick={() => setActiveTab("sampleSpecs")}
//             >
//               Sample Specs
//             </button>
//             <button
//               className={`tab ${activeTab === "add" ? "active-tab" : ""}`}
//               onClick={() => setActiveTab("add")}
//             >
//               Add
//             </button>
//           </div>
//           <div className="tab-content">{renderTabContent()}</div>
//         </>
//       )}

//       {activeButton === "sample2" && (
//         <div>
//           <div className="tabs-container">
//             <button
//               className={`tab ${
//                 activeTab === "sampleSpecs" ? "active-tab" : ""
//               }`}
//               onClick={() => setActiveTab("sampleSpecs")}
//             >
//               Sample Specs
//             </button>
//             <button
//               className={`tab ${activeTab === "add" ? "active-tab" : ""}`}
//               onClick={() => setActiveTab("add")}
//             >
//               Add2
//             </button>
//           </div>
//           <div className="tab-content">{renderTabContent()}</div>
//           {/* <Sample2Component /> */}
//         </div>
//       )}
//     </div>
//   );
// }

// export default SampleSpecsMain;
// import React from "react";
// import Navbar from "../../../Navbar/Navbar";
// import { Box, Button } from "@mui/material";
// import AllSpecs from "./Test/MainTest/AllSpecs";

// function SampleSpecsMain() {
//   return (
//     <div>
//       <Navbar />
//       <Box display="flex" justifyContent="flex-start" mb={2}>
//         <Button variant="contained" color="primary">
//           Back
//         </Button>
//         <Button variant="contained" color="primary">
//           Sample Specs
//         </Button>
//         <Button variant="contained" color="primary">
//           Graded Specs
//         </Button>
//         <Button variant="contained" color="primary">
//           Digital Patterns
//         </Button>
//       </Box>
//      <AllSpecs/>
//     </div>
//   );
// }

// export default SampleSpecsMain;
import React, { useState } from "react";
import Navbar from "../../../Navbar/Navbar";
import { Box, Button, Tabs, Tab } from "@mui/material";
import AllSpecs from "./Test/MainTest/AllSpecs";

function SampleSpecsMain() {
  const [selectedTab, setSelectedTab] = useState(0); 
  const [dataAvailable, setDataAvailable] = useState(false);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleSampleSpecsClick = () => {
 
    setDataAvailable(true); 
  };

  return (
    <div>
      <Navbar />
      <Box display="flex" justifyContent="flex-start" mb={2}>
        <Button variant="contained" color="primary">
          Back
        </Button>
        <Button variant="contained" color="primary" onClick={handleSampleSpecsClick}>
          Sample Specs
        </Button>
        <Button variant="contained" color="primary">
          Graded Specs
        </Button>
        <Button variant="contained" color="primary">
          Digital Patterns
        </Button>
      </Box>

      {/* Dynamic Tabs */}
      {dataAvailable && (
        <Tabs value={selectedTab} onChange={handleTabChange} aria-label="Sample Specs Tabs">
          <Tab label="Add" />
          <Tab label="Sample Specs Data 1" />
          <Tab label="Sample Specs Data 2" />
         
        </Tabs>
      )}

      <AllSpecs selectedTab={selectedTab} dataAvailable={dataAvailable} />
    </div>
  );
}

export default SampleSpecsMain;
