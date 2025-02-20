import React from "react";
import AddTechPack from "./Pages/TechPack/AddTechPack";
import PictureManager from "./Pages/Pictures/picture";
import VerticalTabs from "./Pages/Configuration/Configurations/VerticalTabs";
import SampleRequest from "./Pages/TechPack/sampleRequest";
import VerticalTechPackTable from "./Pages/TechPack/techPackDetails";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PointOfMeasure from "./Pages/Configuration/POM/PointofMeasure";
import WorkOrder from "./Pages/WorkOrder/components/wordOrder";
import WorkOrderDetail from "./Pages/WorkOrder/components/detailWorkOrder/workOrderDetail";
import NewScaleAssignment from "./Pages/Configuration/SizeScaleAssignment/SizeScaleAssignment";
import SpecsTemplate from "./Pages/Configuration/SpecsTemplate/specsTemplate";
import SpecDetail from "./Pages/Configuration/SpecsTemplate/DetailPage/specDetail";
import TrimManagement from "./Pages/Trims/TrimMangement";
import SampleSpecsMain from "./Pages/TechPack/SampleSpecs/SampleSpecsMain";
import Quote from "./Pages/Quotes/quotes";
import Users, { User } from "./Pages/Users/user";
import SaleContract from "./Pages/SalesContract/SaleContract";
import VendorPo from "./Pages/VendorPo/VendorPo";
import FitComment from "./Pages/WorkOrder/components/detailWorkOrder/FitComment/FitComment";
import ShippingTable from "./Pages/Shipping/Shippings/ShippingTable";
import ArrangementTable from "./Pages/Shipping/Arrangements/ArrangmentsTable";
import ReaeivingTable from "./Pages/Receiving/ReaeivingTable";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/picture" element={<PictureManager />} />
        <Route path="/" element={<AddTechPack />} />
        <Route path="/SampleRequest" element={<SampleRequest />} />
        <Route path="/POM" element={<PointOfMeasure />} />
        <Route path="/trim" element={<TrimManagement />} />
        <Route path="/Configuration" element={<VerticalTabs />} />
        <Route path="/tech-pack-detail" element={<VerticalTechPackTable />} />
        <Route path="/sample-specs/:techPackId" element={<SampleSpecsMain />} />

        <Route path="/work-order" element={<WorkOrder />} />
        <Route path="/work-order-detail/:id" element={<WorkOrderDetail />} />
        <Route path="/new-scale-assignment" element={<NewScaleAssignment />} />
        <Route path="/spec-template" element={<SpecsTemplate />} />
        <Route path="/spec-template-detail" element={<SpecDetail />} />
        <Route path="/quotes" element={<Quote />} />
        <Route path="/users" element={<Users />} />
        <Route path="/sales-contract" element={<SaleContract />} />
        <Route path="/vendor-po" element={<VendorPo />} />
        <Route
          path="/work-order-detail/:id/fit-comment"
          element={<FitComment />}
        />
        <Route path="/shipping" element={<ShippingTable />} />
        <Route path="/arrangments" element={<ArrangementTable />} />
        <Route path="/receiving" element={<ReaeivingTable/>} />

      </Routes>
    </div>
  );
}

export default App;

// import React from 'react'
// import TechPackDetails from './Pages/TechPack/techPackDetails'
// import AddTechPack from './Pages/TechPack/AddTechPack'
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// function App() {
//   return (
//     <div>
//       <AddTechPack/>
//       <TechPackDetails/>
//     </div>
//   )
// }

// export default App
